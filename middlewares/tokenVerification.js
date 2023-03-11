const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')

const tokenVerification = async (req, res, next) => {
  console.log('ZZZZZZ', req.headers['x-access-token'])

  let token = null
  if (req.headers['x-access-token'] === undefined) {
    token = req.body.token
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token']
  }
  console.log('TOKEEEEE', token)

  try {
    console.log(req.headers['x-access-token'])

    if (!token) {
      return res.status(403).send({ msg: 'Token missing' })
    } else {
      const tokenAccess = jwt.verify(token, process.env.JWT)
      console.log(tokenAccess, 'tokenAccess')

      const patientExists = await Patient.findById(tokenAccess.id)
      const hospitalExists = await Hospital.findById(tokenAccess.id)

      console.log(patientExists, hospitalExists, 'TOBO BINE TODO CORRECTO')

      if (patientExists) {
        next()
      } else if (hospitalExists) {
        next()
      } else {
        return res.status(404).send({ msg: 'User not found' })
      }
    }

  } catch (error) {
    console.log(error)
    return res.status(401).send({ msg: 'The user is not authorized' })
  }
}

module.exports = { tokenVerification }
