const express = require('express')
const router = express.Router()
const { validateUpdate } = require('../validators/validateUser')
const userController = require('../controllers/user.controller')
const { checkAuth } = require('../middlewares/checkAuth')
const { checkRole, checkRoleWithoutId } = require('../middlewares/checkRole')

router.put(
  '/password/:id',
  checkAuth,
  (req, res, next) => {
    const id = req.params.id
    checkRole(['patient', 'hospital', 'physician'], id)(req, res, next)
  },
  userController.updatePassword
)

router.patch(
  '/:id',
  checkAuth,
  (req, res, next) => {
    const id = req.params.id
    checkRole(['patient', 'hospital'], id)(req, res, next)
  },
  validateUpdate,
  userController.updateUser
)

module.exports = router
