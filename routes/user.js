import express from 'express'
import { googleCallback, refresh } from '../controllers/userController.js'

const router = express.Router()

router.get('/auth/google/callback', googleCallback)
// router.get('/oauth', googleLogin)
router.get('/refresh', refresh)

export default router
