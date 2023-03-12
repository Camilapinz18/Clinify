const express = require('express')
const router = express.Router()
const { validateLogin, validateSignup } = require('../validators/validateAuth')
const authController = require('../controllers/auth.controller')
const { checkAuth } = require('../middlewares/checkAuth')
const { checkRole } = require('../middlewares/checkRole')

router.post('/login', validateLogin, authController.login)
router.post('/signup', validateSignup, authController.signup)
router.post('/verify', checkAuth, validateLogin, authController.verifyAccount)

module.exports = router
