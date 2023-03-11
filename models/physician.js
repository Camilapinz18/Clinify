const mongoose = require('mongoose')

const physicianSchema = new mongoose.Schema({
  identification: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  speciality: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})

const Physician = mongoose.model('Physician', physicianSchema)
module.exports = Physician
