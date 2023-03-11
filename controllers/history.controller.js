const History = require('../models/history')
const Physician = require('../models/physician')
const Patient = require('../models/patient')
const { createPDF } = require('../helpers/pdfCreator')
const cheerio = require('cheerio')
const axios = require('axios')

const allHistories = async (req, res) => {
  try {
    const histories = await History.find()
      .populate('physician')
      .populate('patient')
    res.status(200).send(histories)
  } catch (error) {
    res.status(500).send({ msg: 'Error retrieving the clinic histories' })
  }
}

const byPatientIdHistory = async (req, res) => {
  // Este endpoint solo lo puede usar el paciente

  try {
    const identification = req.params.id

    const patientExists = await Patient.findOne({
      identification: identification
    })

    console.log(
      'patientExists__',
      patientExists.identification,
      '___patientExist'
    )

    if (patientExists) {
      const histories = await History.find({
        patient: patientExists._id
      }).populate('patient').populate('physician')

      console.log('histories', histories)

      /**********pdf */
      //  let dataToPrint = []

      //  histories.map(history => {
      //    dataToPrint.push({
      //     historyDate:history.date,
      //     physicianName:history.physician.name,
      //     physicianIdentification:history.physician.identification,
      //     speciality:history.physician.speciality
      //    })
      //  })

      //  console.log("DATA TO PRINT",dataToPrint)

      // const stream = res.writeHead(200, {
      //   'Content-Type': 'application/pdf',
      //   'Content-Disposition': `attachment;filename=history_${patientExists.identification}.pdf`
      // })
      // createPDF(
      //   chunk => stream.write(chunk),

      //   dataToPrint,
      //   () => stream.end()
      // )

      res.status(200).send(histories)
    } else {
      res.status(404).send({ msg: "Patient doesn't exist" })
    }
  } catch (error) {
    res.status(500).send({ msg: "Error retrieving the patient's history" })
  }
}

const createHistory = async (req, res) => {
  try {
    const { physician, patient } = req.body

    console.log('tttttt!', physician, patient)

    const patientExists = await Patient.findOne({
      identification: patient
    })
    const physicianExists = await Physician.findOne({
      identification: physician
    })

    if (patientExists && physicianExists) {
      const history = new History({
        id: new Date(),
        date: new Date(),
        physician: physicianExists,
        observations: req.body.observations,
        healthState: req.body.healthState,
        patient: patientExists
      })

      console.log('gisotru', history)
      try {
        const historyCreated = await history.save()
        console.log('historyCreated', historyCreated)

        res
          .status(200)
          .send({ msg: 'History created successfully', historyCreated })
      } catch (error) {
        console.log('error', error)
        res
          .status(400)
          .send({ msg: 'Error creating the hisdtory', historyCreated })
      }
    } else {
      res.status(404).send({ msg: 'Physician or patient not found' })
    }

    // const existingPatient = await Patient.findOne({ identification })
    // if (existingPatient) {
    //   res.status(400).send({ msg: 'Patient already exists' })
    // }
    // const patient = new Patient(req.body)
    // await patient.save()
  } catch (error) {
    res.status(500).send({ msg: 'Error creating the History' })
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
  byPatientIdHistory,
  createHistory,
  updateHistory,
  deleteHistory,
  getAllLabs,
  getLabsByFirstLetter
}
