const express = require('express')
const router = express.Router()
const { validateUpdate } = require('../validators/validators')
const userController = require('../controllers/user.controller')
const {tokenVerification} = require('../middlewares/tokenVerification')
const {checkAuth}=require('../middlewares/checkAuth')
const {checkRole}=require('../middlewares/checkRole')

router.patch('/:id', checkAuth,checkRole(['patient','hospital']),validateUpdate, userController.updateUser)

router.put('/password', checkAuth,checkRole(['patient','hospital','physician']), userController.updatePassword)

module.exports = router
