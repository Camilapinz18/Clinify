const express = require('express')
const router = express.Router()
const { validateHospital } = require('../validators/validators')
const hospitalController = require('../controllers/hospital.controller')

router.post('/', validateHospital, hospitalController.createHospital)

module.exports = router
