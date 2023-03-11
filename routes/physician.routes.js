const express = require('express')
const router = express.Router()
const { validatePhysician } = require('../validators/validators')
const physicianController = require('../controllers/physician.controller')

router.get('/', physicianController.allPhysicians)
router.get('/:id', physicianController.byIdPhysician)
router.post('/', validatePhysician, physicianController.createPhysician)
router.put('/:id', validatePhysician, physicianController.updatePhysician)
router.delete('/:id', physicianController.deletePhysician)

module.exports = router
