const jwt = require('jsonwebtoken')

const createToken = async user => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT, {
    expiresIn: 28800 /**8 horas */
  })
}

const verifyToken = async token => {
  console.log('Token:', token)
  try {
    return jwt.verify(token, process.env.JWT)
  } catch (error) {
    console.log(error)
    return null
  }
}

module.exports = {
  createToken,
  verifyToken
}
