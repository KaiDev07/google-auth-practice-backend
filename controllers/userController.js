import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import User from '../models/userModel.js'
import Token from '../models/tokenModel.js'
import createTokens from '../utils/createTokens.js'
import passport from 'passport'
import axios from 'axios'

export const googleCallback = (req, res) => {
    try {
        passport.authenticate('google', {
            successRedirect: process.env.CLIENT_URL,
            failureRedirect: process.env.CLIENT_URL,
        })
    } catch (error) {
        res.status(500).redirect(process.env.CLIENT_URL)
    }
}

export const googleFunction = async (req, res) => {
    try {
        const response = await axios.get(
            'https://accounts.google.com/o/oauth2/v2/auth',
            {
                params: req.query,
            }
        )

        res.send(response)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const refresh = async (req, res) => {
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ error: 'nothing' })
    }
}
