const jwt = require('jsonwebtoken')
const { sendEmailVerification } = require('../helpers/sendEmailVerification')
const User = require('../models/user')
const Role = require('../models/role')
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')
const Physician = require('../models/physician')
const { hashPassword, comparePassword } = require('../helpers/bcryptjs')
const { createToken } = require('../helpers/createToken')

const signup = async (req, res) => {
  try {
    const { identification, password, phone, email, role } = req.body
    const roleToSearch = role.toLowerCase()
    const roleToCreate = await Role.findOne({ name: roleToSearch })
    const patientExists = await Patient.findOne({ identification })
    const hospitalExists = await Hospital.findOne({ identification })

    if (patientExists || hospitalExists) {
      res.status(400).send({ msg: 'The user already exists' })
    } else {
      if (roleToCreate && roleToCreate.name.toLowerCase() === 'patient') {
        if (patientExists) {
          res.status(400).send({ msg: 'Patient already exists' })
        } else {
          const patient = new Patient({
            identification,
            password: await hashPassword(password),
            phone,
            email
          })

          const patientSavedToDB = await patient.save()
          const token = await createToken(patientSavedToDB)
          res.status(200).send({
            msg: 'Patient created successfully',
            patientSavedToDB,
            token: token
          })
        }
      } else if (
        roleToCreate &&
        roleToCreate.name.toLowerCase() === 'hospital'
      ) {
        if (hospitalExists) {
          res.status(400).send({ msg: 'Hospital already exists' })
        } else {
          const hospital = new Hospital({
            identification,
            password: await hashPassword(password),
            phone,
            email
          })

          const hospitalSavedToDB = await hospital.save()
          const token = await createToken(hospitalSavedToDB)

          res.status(200).send({
            msg: 'Hospital created successfully',
            hospitalSavedToDB,
            token: token
          })
        }
      } else {
        res.status(400).send({ msg: 'Invalid role' })
      }
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error creating the user' })
  }
}

const login = async (req, res) => {
  const { identification, password } = req.body

  const patientExists = await Patient.findOne({ identification })
  const hospitalExists = await Hospital.findOne({ identification })
  const physicianExists = await Physician.findOne({ identification })

  let userExists

  if (patientExists) {
    userExists = patientExists
  } else if (hospitalExists) {
    userExists = hospitalExists
  } else if (physicianExists) {
    userExists = physicianExists
  }

  if (userExists) {
    if (userExists.isFirstLogin) {
      const isSamePassword =
        password === physicianExists.password ? true : false

      if (isSamePassword) {
        const token = await createToken(physicianExists)

        res.status(400).send({
          msg: 'This is your first login. Please change your password to continue',
          token
        })
      } else{
        res.status(400).send({
          msg: 'TWrong password'
     
        })
      }
    } else {
      const isSamePassword = await comparePassword(
        password,
        userExists.password
      )

      if (isSamePassword) {
        const token = await createToken(userExists)

        if (userExists.verified === false) {
          try {
            const token = await createToken(userExists)
            sendEmailVerification(userExists, token)
          } catch (error) {
            console.log(error)
          }

          res.status(401).send({
            msg: 'Please verify your account to continue. A code was send to your email'
          })
        } else {
          const token = await createToken(userExists)
          res.status(200).send({ msg: 'Successful login', userExists, token })
        }
      } else {
        res.status(401).send({ msg: 'Wrong password' })
      }
    }
  } else {
    res.status(404).send({ msg: 'User does not exists' })
  }
}

const verifyAccount = async (req, res) => {
  const { identification, password } = req.body

  try {
    const patientExists = await Patient.findOne({ identification })
    const hospitalExists = await Hospital.findOne({ identification })
    const physicianExists = await Physician.findOne({ identification })

    let userExists

    if (patientExists) {
      userExists = patientExists
    } else if (hospitalExists) {
      userExists = hospitalExists
    } else if (physicianExists) {
      userExists = physicianExists
    }

    if (userExists) {
      console.log('HEEEEEER PATIENT', userExists.role)

      const isSamePassword = await comparePassword(
        password,
        userExists.password
      )

      if (isSamePassword) {
        if (userExists && userExists.verified === false) {

console.log()

          switch (userExists?.role) {
            case 'patient':
              await Patient.findByIdAndUpdate(
                userExists._id,
                { verified: true },
                { new: true }
              )
              break

            case 'hospital':
              await Hospital.findByIdAndUpdate(
                userExists._id,
                { verified: true },
                { new: true }
              )
              break

            case 'physician':
              await Physician.findByIdAndUpdate(
                userExists._id,
                { verified: true },
                { new: true }
              )

            default:
              res.status(200).send({
                msg: 'Account verified successfully. Now you can login into your account'
              })
              break
          }

          res.status(200).send({
            msg: 'Account verified successfully. Now you can login into your account'
          })
        } else {
          res.status(400).send({ msg: 'Account already verified' })
        }
      } else {
        res.status(400).send({ msg: 'Wrong password' })
      }
    } else {
      res.status(404).send({ msg: 'User does not exists' })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  signup,
  login,
  verifyAccount
}
