const History = require('../models/history')
const cheerio = require('cheerio')
const axios = require('axios')

const allHistories = async (req, res) => {
  try {
    const histories = await History.find()
    res.status(200).send(histories)
  } catch (error) {
    res.status(500).send({ msg: 'Error retrieving the clinic histories' })
  }
}

const byIdHistory = async (req, res) => {
  try {
    const patients = await Patient.find()
    res.status(200).send(patients)
  } catch (error) {
    res.status(500).send({ msg: 'Error retrieving the patients' })
  }
}

const createHistory = async (req, res) => {
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
  }
}

const updateHistory = async (req, res) => {
  //No se puede modifical, solo añadir cosas anuevas
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

const deleteHistory = async (req, res) => {
  //Si el apciente se borra,la hisdotria tambien

  try {
    await Patient.findOneAndRemove({ identification: req.params.id })
    res.status(200).send({ msg: 'Patient deleted' })
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting the patient' })
  }
}

/**Medlineplus****************** */
const getAllLabs = async (req, res) => {
  console.log('labs')
  try {
    const allLabs = []
    let labs = await axios.get('https://medlineplus.gov/lab-tests/')
    //console.log(labs, 'labs2')
    let $ = await cheerio.load(labs.data)

    const div = $('#section_A > .withident >li').map((index, lab) => {
      const labName = $(lab).find('a').text()
      const url = $(lab).find('a').attr('href')
      allLabs.push({ lab: labName, url: url })
      console.log('labName', labName, url)
    })

    res.status(200).send(allLabs)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ error: 'An error occurred while fetching labs data.' })
  }
}

const getLabsByFirstLetter = async (req, res) => {
  console.log('labsletetr')
  try {
    const allLabsByLetter = []
    let labs = await axios.get('https://medlineplus.gov/lab-tests/')
    //console.log(labs, 'labs2')
    let $ = await cheerio.load(labs.data)

    const letter = req.params.letter.toUpperCase()
    console.log('Letter', letter)

    const div = $(`#section_${letter} > .withident >li`).map((index, lab) => {
      const labName = $(lab).find('a').text()
      const url = $(lab).find('a').attr('href')
      allLabsByLetter.push({ lab: labName, url: url })

      console.log('allLabsByLetter', allLabsByLetter)
    })

    if (allLabsByLetter.length > 0) {
      res.status(200).send(allLabsByLetter)
    } else {
      res.status(404).send({ msg: 'No labs found' })
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ error: 'An error occurred while fetching labs data.' })
  }
}

module.exports = {
  allHistories,
  byIdHistory,
  createHistory,
  updateHistory,
  deleteHistory,
  getAllLabs,
  getLabsByFirstLetter
}
