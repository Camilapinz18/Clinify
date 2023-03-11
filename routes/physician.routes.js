const express = require('express')
const router = express.Router()
const { validatePhysician } = require('../validators/validators')
const physicianController = require('../controllers/physician.controller')
const {checkAuth}=require('../middlewares/checkAuth')
const {checkRole}=require('../middlewares/checkRole')

router.get('/', physicianController.allPhysicians)
router.get('/:id', physicianController.byIdPhysician)
router.post('/', checkAuth,checkRole(['hospital']),validatePhysician, physicianController.createPhysician)
router.put('/:id', validatePhysician, physicianController.updatePhysician)
router.delete('/:id', physicianController.deletePhysician)

module.exports = router
