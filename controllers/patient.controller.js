const Patient = require('../models/patient')
const Physician = require('../models/physician')

const allPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
    res.status(200).send(patients)
  } catch (error) {
    res.status(500).send({ msg: 'Error retrieving tha patients' })
  }
}

const byIdPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ identification: req.params.id })
    console.log('patinet', patient)
    if (patient) {
      res.status(200).send(patient)
    } else {
      res.status(404).send({ msg: 'Patient not found' })
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error retrieving the patient' })
  }
}


const createPatient = async (req, res) => {
  try {
    const { identification } = req.body
    const existingPatient = await Patient.findOne({ identification })
    if (existingPatient) {
      res.status(400).send({ msg: 'Patient already exists' })
    }
    const patient = new Patient(req.body)
    await patient.save()
    res.status(200).send({ msg: 'Patient created successfully' })
  } catch (error) {
    res.status(500).send({ msg: 'Error creating the patient' })
    console.log(error.errors)
  }
}

const updatePatient = async (req, res) => {
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

const deletePatient = async (req, res) => {
  try {
    await Patient.findOneAndRemove({ identification: req.params.id })
    res.status(200).send({ msg: 'Patient deleted' })
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting the patient' })
  }
}

module.exports = {
  allPatients,
  byIdPatient,

  createPatient,
  updatePatient,
  deletePatient
}
