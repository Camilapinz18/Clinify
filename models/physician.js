const mongoose = require('mongoose')
const { hashPassword, comparePassword } = require('../helpers/bcryptjs')

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
  },
  verified: {
    type: Boolean,
    default: false
  },
  password:{
    type:String,
    default: function () {
      return this.identification
    }
  },
  role: {
    type: String,
    default: 'physician'
  },
  isFirstLogin:{
    type:Boolean,
    default:true
  },
  hospital:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  }
})

const Physician = mongoose.model('Physician', physicianSchema)
module.exports = Physician
