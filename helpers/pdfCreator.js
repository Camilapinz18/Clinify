const pdfkit = require('pdfkit')

function createPDF (dataCallback, data,endCallback) {
  const doc = new pdfkit({ bufferPages: true, font: 'Courier' })

  doc.on('data', dataCallback)
  doc.on('end', endCallback)

  data.map(d=> doc.fontSize(13).text(d.values()))
 

  doc
    .fontSize(12)
    .text(
      `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores, saepe.`
    )
  doc.end()
}

module.exports = { createPDF }
