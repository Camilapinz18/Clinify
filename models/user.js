const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  verified: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User
