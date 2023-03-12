const express = require('express')
const router = express.Router()
const { validatePhysician } = require('../validators/validatePhysician')
const physicianController = require('../controllers/physician.controller')
const {checkAuth}=require('../middlewares/checkAuth')
const {checkRole,checkRoleWithoutId}=require('../middlewares/checkRole')

router.post('/', checkAuth,checkRoleWithoutId(['hospital']),validatePhysician, physicianController.createPhysician)

module.exports = router
