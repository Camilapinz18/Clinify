const express = require('express')
const router = express.Router()
const { validateHistory } = require('../validators/validators')
const historyController = require('../controllers/history.controller')
const {checkAuth}=require('../middlewares/checkAuth')
const {checkRole}=require('../middlewares/checkRole')

router.get('/', historyController.allHistories)

router.get('/patient/:id',checkAuth,checkRole(['patient']), historyController.byPatientIdHistory)

router.get('/labs/all', historyController.getAllLabs)
router.get('/labs/:letter', historyController.getLabsByFirstLetter)

router.post('/', historyController.createHistory)
router.put('/:id', historyController.updateHistory)
router.delete('/:id', historyController.deleteHistory)

module.exports = router
