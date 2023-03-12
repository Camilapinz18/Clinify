const express = require('express')
const router = express.Router()
const labsController = require('../controllers/labs.controller')

//router.get('/', labsController.getAllLabs)
router.get('/:letter', labsController.getLabsByFirstLetter)

module.exports = router
