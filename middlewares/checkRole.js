const { verifyToken } = require('../helpers/createToken')
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')
const Physician = require('../models/physician')

const checkRole = roles => async (req, res, next) => {


  console.log("roles",roles)
  try {
    let token = null
    if (req.headers['x-access-token'] === undefined) {
      token = req.body.token
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token']
    }

    if (token) {
      const tokenVerified = await verifyToken(token)
      const patientAuthorized = await Patient.findById(tokenVerified.id)
      const hospitalAuthorized = await Hospital.findById(tokenVerified.id)
      const physicianAuthorized = await Physician.findById(tokenVerified.id)

      let userAuthorized = ''
      patientAuthorized
        ? (userAuthorized = patientAuthorized)
        : hospitalAuthorized
        ? (userAuthorized = hospitalAuthorized)
        : physicianAuthorized
        ? (userAuthorized = physicianAuthorized)
        : ''

      console.log(userAuthorized.role, 'userAuthorized',roles)

      if ([].concat(roles).includes(userAuthorized?.role)) {
        next()
      } else {
        res.status(401).send({ msg: 'Unauthorized user' })
      }
    } else {
      res.status(401).send({ msg: 'Token missing' })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { checkRole }
