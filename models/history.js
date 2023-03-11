const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  diagnose: {
    type: String,
    required: true
  },
  medication: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  laboratory: {
    type: String,
    required: true
  },
  appointment:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  }

})

const History = mongoose.model('History', historySchema)
module.exports = History
