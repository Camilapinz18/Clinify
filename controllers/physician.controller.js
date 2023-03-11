const Physician = require('../models/physician')
const transporter = require('../config/nodemailer')
const { createToken } = require('../helpers/createToken')


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

const allPhysicians = async (req, res) => {
  try {
    const physicians = await Physician.find()
    res.status(200).send(physicians)
  } catch (error) {
    res.status(500).send({ msg: 'Error retrieving the physicians' })
  }
}

const byIdPhysician = async (req, res) => {
  try {
    const patient = await Patient.findOne({ identification: req.params.id })
    console.log('patient', patient._id)
    const appointments = await Appointment.find({
      patient: patient._id
    }).populate('patient')

    console.log('appointments', appointments)
    res.status(200).send(appointments)
  } catch (error) {
    res.status(500).send({ msg: 'Error retrieving the patient appointments' })
  }
}

const bySpecialityPhysician = async (req, res) => {
  try {
    const patient = await Patient.findOne({ identification: req.params.id })
    console.log('patient', patient._id)
    const appointments = await Appointment.find({
      patient: patient._id
    }).populate('patient')
    console.log('appointments', appointments)
    res.status(200).send(appointments)
  } catch (error) {
    res.status(500).send({ msg: 'Error retrieving the patient appointments' })
  }
}

const createPhysician = async (req, res) => {
  console.log('en create')
  try {
    const { identification } = req.body
    const existingPhysician = await Physician.findOne({ identification })
    console.log('existingPhysician', existingPhysician)
    if (existingPhysician) {
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
    
    const physician = new Physician(req.body)

    console.log('physician before saving to db', physician)
    const physicianSavedToDb = await physician.save()
    console.log('physician saved to db', physicianSavedToDb)

    const token = await createToken(physicianSavedToDb)

    try {
      await transporter.sendMail({
        from: '"Verify your Clinify account" <camilapinz96@gmail.com>',
        to: physicianSavedToDb.email,
        subject: 'Verify your Clinify account',
        text: 'Este es un mensaje de prueba',
        html: ` <h1>CLINIFY</h1>
        <h2>Verify your Clinify account</h2>
        <br>
        <h3>Your password to login into your account is ${physicianSavedToDb.identification}</h3>
        <b>Then, provide the following code:</b>
        <h2> ${token}</h2>
        <br>
        <h4>User information:</h4>
        <div>
        <b>Identification:</b> ${physicianSavedToDb.identification}
        <b>Phone:</b> ${physicianSavedToDb.phone}
        <b>Email:</b> ${physicianSavedToDb.email}
        <b>Role:</b> ${physicianSavedToDb.role}
        </div>`
      })
      console.log('email sent')
    } catch (error) {
      console.log('error sending email', error)
      return res.status(500).send({ msg: 'Error sending verification email' })
    }

    return res.status(200).send({
      msg: 'Physician created successfully',
      physicianSavedToDb,
      token
    })
  } catch (error) {
    console.log('error creating physician', error)
    return res.status(500).send({ msg: 'Error creating the Physician' })
  }
}


const updatePhysician = async (req, res) => {
  try {
    const { name, address, phone, email } = req.body

    let patient = await Patient.findOne({ identification: req.params.id })
    console.log('update', patient)

    if (!patient) {
      res.status(404).send({ msg: 'Patient does not exists' })
    } else {
      patient.name = name
      patient.address = address
      patient.phone = phone
      patient.email = email
      patient = await Patient.findOneAndUpdate(
        { identification: req.params.id },
        patient,
        {
          new: true
        }
      )
      res.status(200).send(patient)
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error updating the patient' })
  }
}

const deletePhysician = async (req, res) => {
  try {
    await Patient.findOneAndRemove({ identification: req.params.id })
    res.status(200).send({ msg: 'Patient deleted' })
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting the patient' })
  }
}

module.exports = {
  allPhysicians,
  byIdPhysician,
  bySpecialityPhysician,
  createPhysician,
  updatePhysician,
  deletePhysician
}
