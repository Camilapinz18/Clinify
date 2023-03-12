const History = require('../models/history')
const Physician = require('../models/physician')
const Hospital = require('../models/hospital')
const Patient = require('../models/patient')
const { createPDF } = require('../helpers/pdfCreator')
const cheerio = require('cheerio')
const axios = require('axios')

const byPatientIdHistory = async (req, res) => {
  // Este endpoint solo lo puede usar el paciente

  try {
    const identification = req.params.id

    const patientExists = await Patient.findOne({
      identification: identification
    })

    if (patientExists) {
      const histories = await History.find({
        patient: patientExists._id
      })
        .populate('physician')
        .populate({
          path: 'physician',
          populate: { path: 'hospital' }
        })
        .populate('patient')

      const clinicHistory = {
        patient: {
          identification: histories[0].patient.identification,
          email: histories[0].patient.email,
          phone: histories[0].patient.phone
        },
        historyItem: [
          {
            date: histories[0].date,
            speciality: histories[0].physician.speciality,
            physician: histories[0].physician.name,
            observations: histories[0].observations,
            labs: histories[0].labs,
            healthState: histories[0].healthState
          }
        ]
      }
      try {
        createPDF(histories)
      } catch (error) {
        console.log(error)
      }

      res
        .status(200)
        .send({ msg: 'Clinic history downloaded usccessfully', histories })
    } else {
      res.status(404).send({ msg: "Patient doesn't exist" })
    }
  } catch (error) {
    res.status(500).send({ msg: "Error retrieving the patient's history" })
  }
}

const byPhysicianIdHistory = async (req, res) => {
  // Este endpoint solo lo puede usar el medico

  try {
    const identification = req.params.id

    const physicianExists = await Physician.findOne({
      identification: identification
    })

    if (physicianExists) {
      const histories = await History.find({
        physician: physicianExists._id
      })
        .populate('physician')
        .populate({
          path: 'physician',
          populate: { path: 'hospital' }
        })
        .populate('patient')

      res.status(200).send(histories)
    } else {
      res.status(404).send({ msg: "Physician doesn't exist" })
    }
  } catch (error) {
    res.status(500).send({ msg: "Error retrieving the physician's histories" })
  }
}
const byHospitalIdHistory = async (req, res) => {
  try {
    const identification = req.params.id
    const hospitalExists = await Hospital.findOne({ identification })

    if (!hospitalExists) {
      return res.status(404).send({ msg: "Hospital doesn't exist" })
    }

    const physicians = await Physician.find({
      hospital: hospitalExists._id
    }).populate('hospital')

    const historiesByHospital = await Promise.all(
      physicians.map(async physician => {
        const histories = await History.findOne({
          physician: physician._id
        })
          .populate('physician')
          .populate({ path: 'physician', populate: { path: 'hospital' } })
          .populate('patient')
        return histories
      })
    )
    res.status(200).send(historiesByHospital)
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: "Error retrieving the hospital's histories" })
  }
}

const fetchLabsByLetter = async letter => {
  try {
    const allLabsByLetter = []

    const randomLetter = String.fromCharCode(
      Math.floor(Math.random() * 26) + 97
    )
    const letter = randomLetter.toUpperCase()
    const url = `https://medlineplus.gov/lab-tests/#${letter}`
    const labs = await axios.get(url)

    const $ = await cheerio.load(labs.data)
    const div = $(`#section_${letter} > .withident >li`).map((index, lab) => {
      const labName = $(lab).find('a').text()
      const url = $(lab).find('a').attr('href')
      allLabsByLetter.push({ lab: labName, url: url })
    })

    return allLabsByLetter
  } catch (error) {
    console.error(error)
    throw new Error('An error occurred while fetching labs data.')
  }
}

const fetchLabsInfo = async urls => {
  try {
    const preparations = []
    await Promise.all(
      urls.map(async url => {
        const urlToSearch = url.url
        const dataLabs = await axios.get(urlToSearch)
        const $ = await cheerio.load(dataLabs.data)

        const labName = $(`.page-title`).text().trim()

        $(`.main> section>.mp-content>h2`).each((index, item) => {
          let title = $(item).text()

          if (
            title.includes('need') &&
            title.includes('anything') &&
            title.includes('prepare')
          ) {
            const parentElement = $(item).parent()
            const text = parentElement.find('p:first').text()
            preparations.push({
              lab: labName,
              preparation: text
            })
          }
        })
      })
    )

    return preparations
  } catch (error) {
    console.error(error)
    throw new Error('An error occurred while fetching labs data.')
  }
}

const createHistory = async (req, res) => {
  //Este endpoint solo lo puedo usar el medico
  try {
    const { physician, patient } = req.body

    const patientExists = await Patient.findOne({
      identification: patient
    })
    const physicianExists = await Physician.findOne({
      identification: physician
    })

    if (patientExists && physicianExists) {
      /*labs*/
      const allLabsByLetter = await fetchLabsByLetter()
      let labsToShow = []
      allLabsByLetter.map(lab => {
        labsToShow.push({
          lab: lab.lab,
          url: lab.url
        })
      })

      const randNumber = Math.round(
        Math.random() * Math.round(labsToShow.length / 2)
      )

      const labsToAdd = []
      for (let i = 0; i < randNumber; i++) {
        labsToAdd[i] = labsToShow[i]
      }

      const labsInfo = await fetchLabsInfo(labsToAdd)

      const labsInformation = labsToAdd.map((lab, index) => {
        return {
          name: lab.lab,
          preparation: labsInfo[index]
        }
      })

      const history = new History({
        id: new Date(),
        date: new Date(),
        physician: physicianExists,
        observations: req.body.observations,
        healthState: req.body.healthState,
        patient: patientExists,
        labs: labsInfo
      })

      try {
        const historyCreated = await history.save()

        res
          .status(200)
          .send({ msg: 'History created successfully', historyCreated })
      } catch (error) {
        console.log('error', error)
        res
          .status(400)
          .send({ msg: 'Error creating the history', historyCreated })
      }
    } else {
      res.status(404).send({ msg: 'Physician or patient not found' })
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error creating the History' })
  }
}

module.exports = {
  byPatientIdHistory,
  byPhysicianIdHistory,
  byHospitalIdHistory,
  createHistory
}
