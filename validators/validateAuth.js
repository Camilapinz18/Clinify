const { check } = require('express-validator')
const { validateResult } = require('../helpers/validations.helper')

const validateLogin = [
  check('identification')
    .exists()
    .withMessage('Identification is needed to Login'),

  check('password').exists().withMessage('Password is needed to Login'),

  (request, response, next) => {
    validateResult(request, response, next)
  }
]

const validateSignup = [
  check('identification')
    .exists()
    .isLength({ min: 8 })
    .withMessage('The identification must be at least 8 numbers long')
    .not()
    .isEmpty()
    .isString()
    .matches(/^[0-9]+$/)
    .withMessage('The identification must not contain letters'),

  check('password')
    .exists()
    .not()
    .isEmpty()
    .withMessage('A password is needed to signup')
    .isString()
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[A-Z])/)
    .withMessage(
      'The password must be at least 6 characters long, contain one number and one uppercase letter'
    ),
  check('phone')
    .exists()
    .not()
    .isEmpty()
    .matches(/^\+?\d{8,}$/)
    .withMessage('Please enter a valid phone number'),

  check('email')
    .exists()
    .isEmail()
    .withMessage('Please enter a valid email address'),

  check('role')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .matches(/^[^0-9]*$/)
    .withMessage('The role must not contain numbers'),

  (request, response, next) => {
    validateResult(request, response, next)
  }
]

module.exports = {
  validateLogin,
  validateSignup
}
