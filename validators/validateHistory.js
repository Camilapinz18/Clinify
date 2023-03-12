const { check } = require('express-validator')
const { validateResult } = require('../helpers/validations.helper')

const validateHistory = [
  check('observations')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Please enter observations')
    .isString(),

  check('healthState')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Please enter the patient health state')
    .isString(),
  check('labs')
    .isArray()
    .withMessage('Labs should be an array')
    .custom(values =>
      values.every(
        value => typeof value === 'string' && value.trim().length > 0
      )
    )
    .withMessage('All labs should be non-empty strings'),

  // check('treatment')
  //   .exists()
  //   .not()
  //   .isEmpty()
  //   .isString()
  //   .withMessage('Please enter a valid treatment'),

  // check('laboratory')
  //   .exists()
  //   .not()
  //   .isEmpty()
  //   .isString()
  //   .withMessage('Please enter a valid laboratory'),

  (request, response, next) => {
    validateResult(request, response, next)
  }
]

module.exports = { validateHistory }
