const express = require('express')
const router = express.Router()
const { validateHistory } = require('../validators/validateHistory')
const historyController = require('../controllers/history.controller')
const { checkAuth } = require('../middlewares/checkAuth')
const { checkRole,checkRoleWithoutId } = require('../middlewares/checkRole')

router.get('/', historyController.allHistories)

router.get(
  '/patient/:id',
  checkAuth,
  (req, res, next) => {
    const id = req.params.id
    checkRole(['patient'], id)(req, res, next)
  },
  historyController.byPatientIdHistory
)

router.get(
  '/physician/:id',
  checkAuth,
  (req, res, next) => {
    const id = req.params.id
    checkRole(['physician'], id)(req, res, next)
  },
  historyController.byPhysicianIdHistory
)

router.get(
  '/hospital/:id',
  checkAuth,
  (req, res, next) => {
    const id = req.params.id
    checkRole(['hospital'], id)(req, res, next)
  },
  historyController.byHospitalIdHistory
)

router.post(
  '/',
  checkAuth,
  (req, res, next) => {
    const id = req.params.id
    checkRoleWithoutId(['physician'])(req, res, next)
  },
  validateHistory,
  historyController.createHistory
)

//router.put('/:id', historyController.updateHistory)
//router.delete('/:id', historyController.deleteHistory)

module.exports = router
