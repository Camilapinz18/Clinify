const { verifyToken } = require('../helpers/createToken')

const checkAuth = async (req, res, next) => {
  try {
    let token = null
    if (req.headers['x-access-token'] === undefined) {
      token = req.body.token
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token']
    }

    if (token) {
      const tokenVerified = await verifyToken(token)
      console.log(tokenVerified)

      if (tokenVerified.id) {
        next()
      } else {
        res.status(401).send({ msg: 'User unauthorized' })
      }
    } else {
      res.status(401).send({ msg: 'Token missing' })
    }
  } catch (error) {
    console.log("checkautherror",error)
    res.status(401).send({ msg: 'Invalid token' })
  }
}

module.exports = { checkAuth }
