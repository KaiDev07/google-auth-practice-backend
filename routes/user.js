const express = require('express')
const {
    googleLogin,
    refresh,
    googleRequest,
} = require('../controllers/userController')

const router = express.Router()

router.post('/request', googleRequest)
router.get('/oauth', googleLogin)
router.get('/refresh', refresh)

module.exports = router
