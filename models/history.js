const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
  id: {
    type: Date,
    required: true,
    unique: true
  },
  date:{
    type:Date,
    required:true
  },
  physician:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Physician',
    required: true
  },
  observations : {
    type: String,
    required: true
  },
  healthState:{
    type: String,
    required: true
  },
  patient:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  labs:{
    type:[String]
  }


})

const History = mongoose.model('History', historySchema)
module.exports = History
