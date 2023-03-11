const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
  identification: {
    type: String,
    required: true,
    unique: true
  },
  password: {
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
  },
  role: {
    type: String,
    default: 'patient'
  },
  verified: {
    type: Boolean,
    default: false
  },
  name: {
    type: String
  },
  address: {
    type: String
  },
  dob: {
    type: Date
  }
  
})

const Patient = mongoose.model('Patient', patientSchema)
module.exports = Patient
