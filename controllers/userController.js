import { genSalt, hash as _hash } from 'bcrypt'
import { v4 } from 'uuid'
import User from '../models/userModel'
import Token from '../models/tokenModel'
import createTokens from '../utils/createTokens'
import passport from 'passport'

const googleCallback = (req, res) => {
    try {
        passport.authenticate('google', {
            successRedirect: process.env.CLIENT_URL,
            failureRedirect: process.env.CLIENT_URL,
        })
    } catch (error) {
        res.status(500).redirect(process.env.CLIENT_URL)
    }
}

const refresh = async (req, res) => {
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ error: 'nothing' })
    }
}

export default { googleCallback, refresh }
