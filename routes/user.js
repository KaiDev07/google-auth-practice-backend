import { Router } from 'express'
import { googleCallback, refresh } from '../controllers/userController'

const router = Router()

router.get('/auth/google/callback', googleCallback)
// router.get('/oauth', googleLogin)
router.get('/refresh', refresh)

export default router
