const Physician = require('../models/physician')
const Hospital = require('../models/hospital')
const { sendEmailInformation } = require('../helpers/sendEmailVerification')
const { createToken, verifyToken } = require('../helpers/createToken')

const specialities = [
  'Anesthesiology',
  'Cardiology',
  'Dermatology',
  'Family Medicine',
  'Gastroenterology',
  'Hematology',
  'Neurology',
  'Obstetrics',
  'Gynecology',
  'Oncology',
  'Ophthalmology',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Urology'
]

// const allPhysicians = async (req, res) => {
//   try {
//     const physicians = await Physician.find()
//     res.status(200).send(physicians)
//   } catch (error) {
//     res.status(500).send({ msg: 'Error retrieving the physicians' })
//   }
// }

// const byIdPhysician = async (req, res) => {
//   try {
//     const patient = await Patient.findOne({ identification: req.params.id })
//     console.log('patient', patient._id)
//     const appointments = await Appointment.find({
//       patient: patient._id
//     }).populate('patient')

//     console.log('appointments', appointments)
//     res.status(200).send(appointments)
//   } catch (error) {
//     res.status(500).send({ msg: 'Error retrieving the patient appointments' })
//   }
// }

// const bySpecialityPhysician = async (req, res) => {
//   try {
//     const patient = await Patient.findOne({ identification: req.params.id })
//     console.log('patient', patient._id)
//     const appointments = await Appointment.find({
//       patient: patient._id
//     }).populate('patient')
//     console.log('appointments', appointments)
//     res.status(200).send(appointments)
//   } catch (error) {
//     res.status(500).send({ msg: 'Error retrieving the patient appointments' })
//   }
// }

const createPhysician = async (req, res) => {
  try {
    const { identification } = req.body
    const physicianExists = await Physician.findOne({ identification })
    if (physicianExists) {
      return res.status(400).send({ msg: 'Physician already exists' })
    }
    const specialityExists = specialities.find(especiality => {
      return especiality.toLowerCase() === req.body.speciality.toLowerCase()
    })
    if (!specialityExists) {
      return res.status(400).send({
        msg: 'Speciality does not exist. Select a valid speciality'
      })
    }

    //Add Hospital:
    const token = req.headers['x-access-token']
    const tokenVerified = await verifyToken(token)
    console.log('tokenVerified>>>>>>>>,', tokenVerified.id)

    try {
      const hospitalExists = await Hospital.findOne({
        identification: tokenVerified.id
      })

      console.log('hopsital found', hospitalExists)

      if (hospitalExists) {
        const physician = new Physician({
          identification:req.body.identification,
          name:req.body.name,
          speciality:req.body.speciality,
          phone:req.body.phone,
          email:req.body.email,
          hospital:hospitalExists._id          
        })

        const physicianSavedToDb = await physician.save()
        try {
          // const token = await createToken(physicianSavedToDb)
          sendEmailInformation(physicianSavedToDb)
        } catch (error) {
          return res.status(500).send({ msg: 'Error sending info email' })
        }
        return res.status(200).send({
          msg: 'Physician created successfully',
          physicianSavedToDb
        })
      }
    } catch (error) {
      console.log('9E', error)
    }
  } catch (error) {
    return res.status(500).send({ msg: 'Error creating the Physician' })
  }
}

// const updatePhysician = async (req, res) => {
//   try {
//     const { name, address, phone, email } = req.body

//     let patient = await Patient.findOne({ identification: req.params.id })
//     console.log('update', patient)

//     if (!patient) {
//       res.status(404).send({ msg: 'Patient does not exists' })
//     } else {
//       patient.name = name
//       patient.address = address
//       patient.phone = phone
//       patient.email = email
//       patient = await Patient.findOneAndUpdate(
//         { identification: req.params.id },
//         patient,
//         {
//           new: true
//         }
//       )
//       res.status(200).send(patient)
//     }
//   } catch (error) {
//     res.status(500).send({ msg: 'Error updating the patient' })
//   }
// }

// const deletePhysician = async (req, res) => {
//   try {
//     await Patient.findOneAndRemove({ identification: req.params.id })
//     res.status(200).send({ msg: 'Patient deleted' })
//   } catch (error) {
//     res.status(500).json({ msg: 'Error deleting the patient' })
//   }
// }

module.exports = {
  createPhysician
  // allPhysicians,
  // byIdPhysician,
  // bySpecialityPhysician,

  // updatePhysician,
  // deletePhysician
}
