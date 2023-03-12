const { check } = require('express-validator')
const { validateResult } = require('../helpers/validations.helper')

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
    .withMessage('Enter an address to continue')
    .isString()
    .withMessage('Please enter a valid address'),

  (request, response, next) => {
    validateResult(request, response, next)
  }
]

module.exports = { validateUpdate }
