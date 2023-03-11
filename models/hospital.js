const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema({
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
    default: 'hospital'
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
  services: {
    type: [String]
  }
})

const Hospital = mongoose.model('Hospital', hospitalSchema)
module.exports = Hospital
