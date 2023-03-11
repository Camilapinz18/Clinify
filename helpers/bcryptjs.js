const bcriptjs = require('bcryptjs')

const hashPassword = async password => {
  const salt = await bcriptjs.genSalt(10)
  const hashedPassword = await bcriptjs.hash(password, salt)
  return hashedPassword
}

const comparePassword = async (password, hashedPasswordToCompare) => {
  return await bcriptjs.compare(password, hashedPasswordToCompare)
}

module.exports = {
  hashPassword,
  comparePassword
}
