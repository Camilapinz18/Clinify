const { check } = require('express-validator')
const { validateResult } = require('../helpers/validations.helper')

const validateUser = [
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
    .withMessage(
      'Please enter a valid phone number. A valid number constains at least 8 numbers'
    ),
  check('email')
    .exists()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  (request, response, next) => {
    validateResult(request, response, next)
  }
]

const validateUpdate = [
  check('name')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Enter a name to continue')
    .isString()
    .matches(/^[^0-9]*$/)
    .withMessage('The name must not contain numbers'),
  
  check('address')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .withMessage('Please enter a valid address'),
  // check('dob')
  //   .exists()
  //   .isDate()
  //   .toDate()
  //   .withMessage('Please enter a valid date of birth'),
  (request, response, next) => {
    validateResult(request, response, next)
  }
]

const validateLogin = [
  check('identification')
    .exists()
    .withMessage('Identification is needed to Login'),
  check('password').exists().withMessage('Password is needed to Login')
]

const validateData = [
  check('identification')
    .exists()
    .isLength({ min: 8 })
    .withMessage('The identification must be at least 8 numbers long')
    .not()
    .isEmpty()
    .isString()
    .matches(/^[0-9]+$/)
    .withMessage('The identification must not contain letters'),

  check('name')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .matches(/^[^0-9]*$/)
    .withMessage('The name must not contain numbers'),
  check('surname')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .matches(/^[^0-9]*$/)
    .withMessage('The name must not contain numbers'),

  check('age')
    .exists()
    .not()
    .isEmpty()
    .isInt()
    .withMessage('Please enter a valid date'),

  check('address')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .withMessage('Please enter a valid address'),

  check('phone')
    .exists()
    .not()
    .isEmpty()
    .matches(/^\+?\d{8,}$/)
    .withMessage('Please enter a valid phone number'),

  (request, response, next) => {
    validateResult(request, response, next)
  }
]

const validateHospital = [
  check('identification')
    .exists()
    .isLength({ min: 8 })
    .withMessage(
      'The hospitalary identification must be at least 8 numbers long'
    )
    .not()
    .isEmpty()
    .isString()
    .matches(/^[0-9]+$/)
    .withMessage('The identification must not contain letters'),

  check('name')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .matches(/^[^0-9]*$/)
    .withMessage('The name must not contain numbers'),

  check('password')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[A-Z])/)
    .withMessage(
      'The password must be at least 8 characters long, contain one number and one uppercase letter'
    ),
  check('email')
    .exists()
    .isEmail()
    .withMessage('Please enter a valid email address'),

  check('phone')
    .exists()
    .not()
    .isEmpty()
    .matches(/^\+?\d{8,}$/)
    .withMessage('Please enter a valid phone number'),

  (request, response, next) => {
    validateResult(request, response, next)
  }
]

const validateHistory = [
  check('diagnose')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .withMessage('Please enter a valid medication'),
  check('medication')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .withMessage('Please enter a valid medication'),

  check('treatment')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .withMessage('Please enter a valid treatment'),

  check('laboratory')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .withMessage('Please enter a valid laboratory'),

  (request, response, next) => {
    validateResult(request, response, next)
  }
]

const validateAppointment = [
  // check('date')
  //   .exists()
  //   .not()
  //   .isEmpty()
  //   .isDate()
  //   .withMessage('Please enter a valid date'),

  check('patient')
    .exists()
    .isLength({ min: 8 })
    .withMessage('The identification must be at least 8 numbers long')
    .not()
    .isEmpty()
    .isString()
    .matches(/^[0-9]+$/)
    .withMessage('The identification must not contain letters'),

  check('physician')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .withMessage('Please enter a valid physician name'),

  (request, response, next) => {
    validateResult(request, response, next)
  }
]

const validatePhysician = [
  check('identification')
    .exists()
    .isLength({ min: 8 })
    .withMessage('The identification must be at least 8 numbers long')
    .not()
    .isEmpty()
    .isString()
    .matches(/^[0-9]+$/)
    .withMessage('The identification must not contain letters'),

  check('name')
    .exists()
    .not()
    .isEmpty()
    .isString()
    .matches(/^[^0-9]*$/)
    .withMessage('The name must not contain numbers'),

  check('email')
    .exists()
    .isEmail()
    .withMessage('Please enter a valid email address'),

  check('phone')
    .exists()
    .not()
    .isEmpty()
    .matches(/^\+?\d{8,}$/)
    .withMessage('Please enter a valid phone number'),

  (request, response, next) => {
    validateResult(request, response, next)
  }
]

module.exports = {
  validateUser,
  validateUpdate,
  validateLogin,
  validateData,
  validateHistory,
  validateHospital,
  validateAppointment,
  validatePhysician
}
