const express = require('express')
const router = express.Router()
const { validateUser,validateLogin } = require('../validators/validators')
const authController = require('../controllers/auth.controller')
const {tokenVerification} = require('../middlewares/tokenVerification')

router.post('/login', validateLogin, authController.login)
router.post('/signup', validateUser, authController.signup)
router.post('/verify', tokenVerification,validateLogin, authController.verifyAccount)


module.exports = router
