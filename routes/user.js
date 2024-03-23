import express from 'express'
import {
    googleCallback,
    refresh,
    googleFunction,
} from '../controllers/userController.js'

const router = express.Router()

router.get('/auth/google/callback', googleCallback)
router.get('/auth/google', googleFunction)
router.get('/refresh', refresh)

export default router
