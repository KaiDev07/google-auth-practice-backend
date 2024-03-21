const { OAuth2Client } = require('google-auth-library')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const jwt = require('jsonwebtoken')

const createTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '30m',
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d',
    })

    return {
        accessToken,
        refreshToken,
    }
}

const googleLogin = async (req, res) => {
    try {
        const code = req.query.code
        const client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        )
        const response = await client.getToken(code)
        await client.setCredentials(response.tokens)
        const ticket = await client.verifyIdToken({
            idToken: client.credentials.id_token,
            audience: process.env.CLIENT_ID,
        })
        const payload = await ticket.getPayload()

        const user1 = await User.findOne({ email: payload.sub + '@gmail.com' })
        if (user1) {
            const tokenPayload = {
                id: user1._id,
                email: user1.email,
                isActivated: user1.isActivated,
            }
            const tokens = createTokens(tokenPayload)

            await Token.savetoken(user1._id, tokens.refreshToken)

            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
        } else {
            const password = uuid.v4()
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            const user = await User.create({
                email: payload.sub + '@gmail.com',
                password: hash,
                isActivated: true,
                name: payload.name,
            })

            const tokenPayload = {
                id: user._id,
                email: user.email,
                isActivated: user.isActivated,
            }
            const tokens = createTokens(tokenPayload)

            await Token.savetoken(user._id, tokens.refreshToken)

            res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })
        }
        res.status(302).redirect(process.env.CLIENT_URL)
    } catch (error) {
        res.json({ error: error.message })
    }
}

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies

        const user = await User.refresh(refreshToken)

        const tokenPayload = {
            id: user._id,
            email: user.email,
            isActivated: user.isActivated,
        }
        const tokens = createTokens(tokenPayload)

        await Token.savetoken(user._id, tokens.refreshToken)

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })

        res.status(200).json({
            accessToken: tokens.accessToken,
            user: { ...tokenPayload, name: user.name },
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const googleRequest = async (req, res) => {
    try {
        res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL)

        const client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        )

        const authorizeUrl = client.generateAuthUrl({
            access_type: 'offline', //to force a refresh token to be created
            scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
            prompt: 'consent',
        })

        res.status(200).json({ url: authorizeUrl })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { googleLogin, refresh, googleRequest }
