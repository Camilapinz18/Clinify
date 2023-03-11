const Hospital = require('../models/hospital')

const createHospital = async (req, res) => {
  try {
    const { identification } = req.body
    const existingHospital = await Hospital.findOne({ identification })
    if (existingHospital) {
      res.status(400).send({ msg: 'Hospital already exists' })
    }
    const hospital = new Hospital(req.body)
    await hospital.save()
    res.status(200).send({ msg: 'Hospital created successfully' })
  } catch (error) {
    res.status(500).send({ msg: 'Error creating the hospital' })
    console.log(error.errors)
  }
}

module.exports = {
  createHospital
}
