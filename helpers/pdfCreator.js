const PDFDocument = require('pdfkit')
const fs = require('fs')

let pdfDoc = new PDFDocument()

const createPDF = histories => {
  const fileName = `ClinicHistory_${Date.now()}.pdf`
  pdfDoc.pipe(fs.createWriteStream(fileName))

  pdfDoc.font('Helvetica').fontSize(15).fillColor('black').text('Clinify')
  pdfDoc.text('Clinic History', { align: 'center' })

  //header:
  pdfDoc.text('Patient information:')
  let patientData = [
    `Identification: ${histories[0].patient.identification}`,
    `Phone: ${histories[0].patient.phone}`,
    `Email: ${histories[0].patient.email}`
  ]
  pdfDoc.list(patientData)
  pdfDoc.moveDown()
  pdfDoc.moveDown()
  pdfDoc.moveDown()

  //items
  pdfDoc.text('Clinic Historial', { align: 'center' })

  for (let i = 0; i < histories.length; i++) {
    const history = histories[i]

    pdfDoc.text(`History #${i + 1}`)
    pdfDoc.moveDown()
    pdfDoc.text(`Date: ${history.date}`)
    pdfDoc.moveDown()

    pdfDoc.text('Physician information:')
    let physicianData = [
      `Name: ${history.physician.name}`,
      `Speciality: ${history.physician.speciality}`,
      `Phone: ${history.physician.phone}`,
      `Email: ${history.physician.email}`,
      `Hospital ID: ${history.physician?.hospital?.identification}`
    ]
    pdfDoc.list(physicianData)
    pdfDoc.moveDown()

    pdfDoc.text('Observations:')
    pdfDoc.text(history.observations)
    pdfDoc.moveDown()

    pdfDoc.text('Health State:')
    pdfDoc.text(history.healthState)
    pdfDoc.moveDown()

    pdfDoc.text('Labs:')
    let labData = history.labs.map(lab => [
      `Name: ${lab.lab}`, `Preparation: ${lab.preparation}`
    ])
    console.log('labData', labData)

    pdfDoc.list(labData)

    pdfDoc.moveDown()
    pdfDoc.moveDown()
  }

  pdfDoc.end()
  pdfDoc = new PDFDocument()
}

module.exports = { createPDF }
