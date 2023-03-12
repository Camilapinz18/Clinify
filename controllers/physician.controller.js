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
      console.log(error)
    }
  } catch (error) {
    return res.status(500).send({ msg: 'Error creating the Physician' })
  }
}

module.exports = {
  createPhysician
}
