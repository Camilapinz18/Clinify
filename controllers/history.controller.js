const History = require('../models/history')
const Physician = require('../models/physician')
const Hospital = require('../models/hospital')
const Patient = require('../models/patient')
const { createPDF } = require('../helpers/pdfCreator')
const cheerio = require('cheerio')
const axios = require('axios')

const allHistories = async (req, res) => {
  try {
    const histories = await History.find()
      .populate('physician')
      .populate({
        path: 'physician',
        populate: { path: 'hospital' }
      })
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
      })
        .populate('physician')
        .populate({
          path: 'physician',
          populate: { path: 'hospital' }
        })
        .populate('patient')

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

const byPhysicianIdHistory = async (req, res) => {
  // Este endpoint solo lo puede usar el paciente

  try {
    const identification = req.params.id

    const physicianExists = await Physician.findOne({
      identification: identification
    })

    console.log(
      'physicianExists',
      physicianExists.identification,
      '___patientExist'
    )

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

      console.log('histories', histories)

    
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
    const identification = req.params.id;
    const hospitalExists = await Hospital.findOne({ identification });

    if (!hospitalExists) {
      return res.status(404).send({ msg: "Hospital doesn't exist" });
    }

    const physicians = await Physician.find({
      hospital: hospitalExists._id,
    }).populate('hospital');

    const historiesByHospital = await Promise.all(
      physicians.map(async (physician) => {
        const histories = await History.findOne({
          physician: physician._id,
        })
          .populate('physician')
          .populate({ path: 'physician', populate: { path: 'hospital' } })
          .populate('patient');

        return histories;
      })
    );

    historiesByHospital.shift()
    res.status(200).send(historiesByHospital);
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error retrieving the hospital's histories" });
  }
};


const fetchLabsByLetter = async letter => {
  try {
    const allLabsByLetter = []

    const randomLetter = String.fromCharCode(
      Math.floor(Math.random() * 26) + 97
    )

    const letter = randomLetter.toUpperCase()
    console.log('letter', letter)

    const url = `https://medlineplus.gov/lab-tests/#${letter}`
    const labs = await axios.get(url)

    const $ = await cheerio.load(labs.data)
    const div = $(`#section_${letter} > .withident >li`).map((index, lab) => {
      const labName = $(lab).find('a').text()
      const url = $(lab).find('a').attr('href')
      allLabsByLetter.push({ lab: labName, url: url })
    })

    console.log(`Labs starting with ${letter}:`, allLabsByLetter)
    return allLabsByLetter
  } catch (error) {
    console.error(error)
    throw new Error('An error occurred while fetching labs data.')
  }
}

const createHistory = async (req, res) => {
  //Este endpoint solo lo puedo usar el medico
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
      /*labs*/

      const allLabsByLetter = await fetchLabsByLetter()

      let labsToShow = []

      allLabsByLetter.map(lab => {
        labsToShow.push(lab.lab)
      })

      console.log('labsToShow___', labsToShow)

      const randNumber = Math.round(
        Math.random() * Math.round(labsToShow.length / 2)
      )
      console.log('randNumber', randNumber)

      const labsToAdd = []
      for (let i = 0; i < randNumber; i++) {
        labsToAdd[i] = labsToShow[i]
      }

      console.log('labsToAdd', labsToAdd)
      //const randomLabs=

      if (allLabsByLetter.length > 0) {
        // If labs data found, add it to the history
        const history = new History({
          id: new Date(),
          date: new Date(),
          physician: physicianExists,
          observations: req.body.observations,
          healthState: req.body.healthState,
          patient: patientExists,
          labs: labsToAdd
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
            .send({ msg: 'Error creating the history', historyCreated })
        }
      } else {
        // If no labs data found, send error response
        res.status(404).send({ msg: 'No labs found' })
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

// const updateHistory = async (req, res) => {
//   //No se puede modifical, solo añadir cosas anuevas
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

// const deleteHistory = async (req, res) => {
//   //Si el apciente se borra,la hisdotria tambien

//   try {
//     await Patient.findOneAndRemove({ identification: req.params.id })
//     res.status(200).send({ msg: 'Patient deleted' })
//   } catch (error) {
//     res.status(500).json({ msg: 'Error deleting the patient' })
//   }
// }

module.exports = {
  allHistories,
  byPatientIdHistory,
  byPhysicianIdHistory,
  byHospitalIdHistory,
  createHistory
}
