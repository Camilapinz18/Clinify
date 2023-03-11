const express = require('express')
const router = express.Router()
const { validateHistory } = require('../validators/validators')
const historyController = require('../controllers/history.controller')

router.get('/', historyController.allHistories)
router.get('/:id', historyController.byIdHistory)
router.get('/labs/all', historyController.getAllLabs)
router.get('/labs/:letter', historyController.getLabsByFirstLetter)

router.post('/', validateHistory, historyController.createHistory)
router.put('/:id', validateHistory, historyController.updateHistory)
router.delete('/:id', historyController.deleteHistory)

module.exports = router
