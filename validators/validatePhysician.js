const { check } = require('express-validator')
const { validateResult } = require('../helpers/validations.helper')

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
    validatePhysician
  }
  