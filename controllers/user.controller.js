const User = require('../models/user')
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')
const Physician = require('../models/physician')
const { hashPassword, comparePassword } = require('../helpers/bcryptjs')

const updateUser = async (req, res) => {
  try {
    const identification = req.params.id
    console.log('identification', identification)

    const patientToModify = await Patient.findOne({ identification })
    const hospitalToModify = await Hospital.findOne({ identification })

    console.log(patientToModify, patientToModify, 'userToModify')

    if (patientToModify) {
      patientToModify.name = req.body.name

      patientToModify.address = req.body.address
      patientToModify.dob = req.body.dob

      res
        .status(200)
        .send({ msg: 'patient updated successfully', patientToModify })
    } else if (hospitalToModify) {
      hospitalToModify.name = req.body.name
      hospitalToModify.address = req.body.address
      console.log(req.body.services)

      req.body.services.map(service => {
        hospitalToModify.services.push(service)
      })

      hospitalToModify.services = [...new Set(hospitalToModify.services)]

      const updatedHospital = await hospitalToModify.save()

      res
        .status(200)
        .send({ msg: 'hospital updated successfully', hospitalToModify })
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error creating the hospital' })
    console.log(error.errors)
  }
}

const updatePassword = async (req, res) => {
  console.log('CACAXXXXXXXXX')
  try {
    const identification = req.body.identification
    console.log('identification>>>>>>>>>', identification)

    const patientToModify = await Patient.findOne({ identification })
    const hospitalToModify = await Hospital.findOne({ identification })
    const physicianToModify = await Physician.findOne({ identification })

    console.log(
      'userToModify',
      patientToModify,
      hospitalToModify,
      physicianToModify
    )

    if (patientToModify) {
      patientToModify.password = await hashPassword(req.body.password)
      console.log('password', patientToModify.password)

      const updatedPatient = await patientToModify.save()

      res
        .status(200)
        .send({ msg: 'Password updated successfully', updatedPatient })
    } else if (hospitalToModify) {
      hospitalToModify.password = await hashPassword(req.body.password)

      const updatedHospital = await hospitalToModify.save()

      res
        .status(200)
        .send({ msg: 'Password updated successfully', updatedHospital })
    } else if (physicianToModify) {
      physicianToModify.password = await hashPassword(req.body.password)

      if (physicianToModify.isFirstLogin === true) {
        physicianToModify.isFirstLogin = false
      }
      const updatedPhysician = await physicianToModify.save()
      console.log('aqeui', updatedPhysician)

      res
        .status(200)
        .send({ msg: 'Password updated successfully', updatedPhysician })
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error updating the password' })
    console.log(error.errors)
  }
}

module.exports = {
  updateUser,
  updatePassword
}
