const express = require('express')
const router = express.Router()
const { validateData } = require('../validators/validators')
const patientController = require('../controllers/patient.controller')

router.get('/', patientController.allPatients)
router.get('/:id', patientController.byIdPatient)
router.post('/', validateData, patientController.createPatient)
router.put('/:id', validateData, patientController.updatePatient)
router.delete('/:id', patientController.deletePatient)

module.exports = router
