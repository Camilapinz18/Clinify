const jwt = require('jsonwebtoken')
const transporter = require('../config/nodemailer')
const User = require('../models/user')
const Role = require('../models/role')
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')
const { hashPassword, comparePassword } = require('../helpers/bcryptjs')
const {createToken}=require('../helpers/createToken')

const signup = async (req, res) => {
  try {
    const { identification, password, phone, email, role } = req.body
    const roleToSearch = role.toLowerCase()
    const roleToCreate = await Role.findOne({ name: roleToSearch })
    console.log('WWWWWW', roleToCreate)

    const patientExists = await Patient.findOne({ identification })
    const hospitalExists = await Hospital.findOne({ identification })

    if (patientExists || hospitalExists) {
      res.status(400).send({ msg: 'The user already exists' })
    } else {
      if (roleToCreate && roleToCreate.name.toLowerCase() === 'patient') {
        console.log('patientExists', patientExists)
        if (patientExists) {
          res.status(400).send({ msg: 'Patient already exists' })
          return
        } else {
          const patient = new Patient({
            identification,
            password: await hashPassword(password),
            phone,
            email
          })

          const patientSavedToDB = await patient.save()

          const token = await createToken(patientSavedToDB)

          try {
            await transporter.sendMail({
              from: '"Verify your Clinify account" <camilapinz96@gmail.com>',
              to: email,
              subject: 'Verify your Clinify account',
              text: 'Este es un mensaje de prueba',
              html: `<b>Please verify your Clinify account. Login in Clinify and insert this code: ${token}</b>`
            })
            console.log('email sended')
          } catch (error) {
            console.log(error)
          }

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
        const hospitalExists = await Hospital.findOne({ identification })
        console.log('hospitalExists', hospitalExists)
        if (hospitalExists) {
          res.status(400).send({ msg: 'Hospital already exists' })
          return
        } else {
          const hospital = new Hospital({
            identification,
            password: await hashPassword(password),
            phone,
            email
          })

          const hospitalSavedToDB = await hospital.save()

          const token = await createToken(hospitalSavedToDB)

          try {
            await transporter.sendMail({
              from: '"Verify your Clinify account" <camilapinz96@gmail.com>',
              to: email,
              subject: 'Verify your Clinify account',
              text: 'Este es un mensaje de prueba',
              html: `<b>Please verify your Clinify account. Login in Clinify and insert this code: ${token}</b>`
            })
            console.log('email sended')
          } catch (error) {
            console.log(error)
          }

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
    console.log(error.errors)
  }
}

//Verify if the user already exists:

// if (userExists) {
// } else {
//   //verify role:
//   const role = await Role.findOne({ name: roleToSearch })

//   if (role) {
//     if (role.name === 'doctor') {
//       res
//         .status(401)
//         .send({ msg: 'Doctors can only be created by a Hospital user' })
//     } else {
//       const user = new User({
//         identification,
//         password: await hashPassword(password),
//         phone,
//         email,
//         role: role._id
//       })

//       const userSavedToDB = await user.save()

//       const token = jwt.sign({ id: userSavedToDB._id }, process.env.JWT, {
//         expiresIn: 28800 /**8 horas */
//       })

//       try {
//         await transporter.sendMail({
//           from: '"Verify your Clinify account" <camilapinz96@gmail.com>',
//           to: email,
//           subject: 'Verify your Clinify account',
//           text: 'Este es un mensaje de prueba',
//           html: `<b>Please verify your Clinify account. Login in Clinify and insert this code: ${token}</b>`
//         })
//         console.log('email sended')
//       } catch (error) {
//         console.log(error)
//       }

//       res.status(200).send({
//         msg: 'user created successfully',
//         userSavedToDB,
//         token: token
//       })
//     }

//console.log(token,"token")
//EMAIL VEIRFICIAITON:

const login = async (req, res) => {
  console.log('login')
  const { identification, password } = req.body

  const patientExists = await Patient.findOne({ identification })
  const hospitalExists = await Hospital.findOne({ identification })

  console.log(patientExists, hospitalExists, 'DSHNJFDSHJFDHK')
  if (patientExists) {
    if (patientExists.verified === false) {
      console.log('No esta verificado')
      res.status(401).send({
        msg: 'Please verify your account to continue. A code was send to your email'
      })
    } else {
      const isSamePassword = await comparePassword(
        password,
        patientExists.password
      )

      if (isSamePassword) {
        console.log(patientExists)
        const token = jwt.sign({ id: patientExists._id }, process.env.JWT, {
          expiresIn: 28800 /**8 horas */
        })

        res.status(200).send({ msg: 'Successful login', patientExists, token })
      } else {
        res.status(401).send({ msg: 'Wrong password' })
      }
    }
  } else if (hospitalExists) {
    if (hospitalExists.verified === false) {
      console.log('No esta verificado')
      res.status(401).send({
        msg: 'Please verify your account to continue. A code was send to your email'
      })
    } else {
      const isSamePassword = await comparePassword(
        password,
        patientExists.password
      )

      if (isSamePassword) {
        console.log(hospitalExists)
        const token = jwt.sign({ id: hospitalExists._id }, process.env.JWT, {
          expiresIn: 28800 /**8 horas */
        })

        res.status(200).send({ msg: 'Successful login', hospitalExists, token })
      } else {
        res.status(401).send({ msg: 'Wrong password' })
      }
    }
  } else {
    res.status(404).send({ msg: 'User does not exists' })
  }
}

const verifyAccount = async (req, res) => {
  console.log('verifyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
  const { identification, password } = req.body

  try {
    const patientExists = await Patient.findOne({ identification })
    const hospitalExists = await Hospital.findOne({ identification })
    console.log('PPPPPPPPP', patientExists, hospitalExists)

    if (patientExists) {
      if (patientExists && patientExists.verified === false) {
        console.log('HEEEEEER PATIENT')
        const updatedUser = await Patient.findByIdAndUpdate(
          patientExists._id,
          { verified: true },
          { new: true }
        )
        console.log(updatedUser)

        res.status(200).send({
          msg: 'Account verified successfully. Now you can login into your account'
        })
      }
    } else if (hospitalExists) {
      console.log('HEEEEEER HOSPITAL')
      if (hospitalExists && hospitalExists.verified === false) {
        const updatedUser = await Hospital.findByIdAndUpdate(
          hospitalExists._id,
          { verified: true },
          { new: true }
        )
        console.log(updatedUser)

        res.status(200).send({
          msg: 'Account verified successfully. Now you can login into your account'
        })
      }
    } else {
      res.status(400).send({ msg: 'Account already verified' })
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
