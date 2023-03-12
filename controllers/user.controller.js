const User = require('../models/user')
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')
const Physician = require('../models/physician')
const { hashPassword, comparePassword } = require('../helpers/bcryptjs')

const updateUser = async (req, res) => {
  try {
    const identification = req.params.id
    const patientToModify = await Patient.findOne({
      identification: identification
    })
    const hospitalToModify = await Hospital.findOne({
      identification: identification
    })

    let userToModify

    if (patientToModify) {
      userToModify = patientToModify
    } else if (hospitalToModify) {
      userToModify = hospitalToModify
    }

    if (userToModify) {
      switch (userToModify.role) {
        case 'patient':
          userToModify.name = req.body.name
          userToModify.address = req.body.address
          userToModify.dob = req.body.dob
          break

        case 'hospital':
          userToModify.name = req.body.name
          userToModify.address = req.body.address

          req.body.services.map(service => {
            userToModify.services.push(service)
          })

          userToModify.services = [...new Set(userToModify.services)]

        default:
          break
      }

      try {
        const updatedUser = await userToModify.save()
        res.status(200).send({ msg: 'User updated successfully', updatedUser })
      } catch (error) {
        console.log('ERROR', error)
      }
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error updating the user' })
    console.log(error)
  }
}

const updatePassword = async (req, res) => {
  try {
    const identification = req.params.id

    const patientToModify = await Patient.findOne({ identification })
    const hospitalToModify = await Hospital.findOne({ identification })
    const physicianToModify = await Physician.findOne({ identification })

    let userToModify

    if (patientToModify) {
      userToModify = patientToModify
    } else if (hospitalToModify) {
      userToModify = hospitalToModify
    } else if (physicianToModify) {
      userToModify = physicianToModify
    }

    let updatedUser = ''
    if (userToModify) {
      if ((userToModify.role = 'physician')) {
        userToModify.password = await hashPassword(req.body.password)

        if (userToModify.isFirstLogin === true) {
          userToModify.isFirstLogin = false
        }
        updatedUser = await userToModify.save()
      } else {
        userToModify.password = await hashPassword(req.body.password)
        console.log('password', userToModify.password)

        updatedUser = await userToModify.save()
      }

      res
        .status(200)
        .send({ msg: 'Password updated successfully', updatedUser })
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error updating the password' })
    console.log(error)
  }
}

module.exports = {
  updateUser,
  updatePassword
}
