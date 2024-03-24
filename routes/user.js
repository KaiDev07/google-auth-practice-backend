import express from 'express'
import passport from 'passport'
import { refresh, logout, getAllUsers } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: process.env.CLIENT_URL,
    })
)

router.post('/logout', logout)
router.get('/refresh', refresh)
router.get('/getusers', authMiddleware, getAllUsers)

export default router
