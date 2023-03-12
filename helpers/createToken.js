const jwt = require('jsonwebtoken')

const createToken = async user => {
  return jwt.sign(
    { id: user.identification, role: user.role },
    process.env.JWT,
    {
      expiresIn: 28800 /**8 horas */
    }
  )
}

const verifyToken = async token => {
  try {
    return jwt.verify(token, process.env.JWT)
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { error: 'Token expired' }
    } else {
      console.log(error)
      return null
    }
  }
}

module.exports = {
  createToken,
  verifyToken
}
