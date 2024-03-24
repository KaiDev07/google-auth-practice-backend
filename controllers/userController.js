import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import User from '../models/userModel.js'
import Token from '../models/tokenModel.js'
import createTokens from '../utils/createTokens.js'

export const refresh = async (req, res) => {
    if (req.user) {
        try {
            const findUser = await User.findOne({
                email: req.user._json.sub + '@gmail.com',
            })
            if (findUser) {
                res.status(200).json({
                    user: {
                        email: findUser.email,
                        isActivated: findUser.isActivated,
                        name: findUser.name,
                    },
                })
            } else {
                const password = v4()
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(password, salt)

                const payload = {
                    email: req.user._json.sub + '@gmail.com',
                    password: hash,
                    isActivated: true,
                    name: req.user._json.name,
                }

                const user = await User.create(payload)

                res.status(200).json({
                    user: {
                        email: user.email,
                        isActivated: user.isActivated,
                        name: user.name,
                    },
                })
            }
        } catch (error) {
            res.status(400).json({
                error: error?.message ? error.message : 'Unexpected error',
            })
        }
    } else {
        res.status(400).json({ error: 'User is not authorized' })
    }
}

export const logout = (req, res) => {
    try {
        if (req.user) {
            req.logout((err) => {
                if (err) {
                    throw Error('Error during logout')
                }
                res.end()
            })
        } else {
            throw Error('Already logged out')
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
