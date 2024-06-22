const { deleteUser } = require('../api/controllers/user')
const User = require('../api/models/user')
const { verifyJwt } = require('../config/jwt')

const sameUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json('No hay token')
    }

    const parsedToken = token.replace('Bearer ', '')
    const { id } = verifyJwt(parsedToken)
    const user = await User.findById(id)

    if (id === req.params.id) {
      user.password = null
      req.user = user
      return deleteUser(req, res, next)
    } else {
      next()
    }
  } catch (error) {
    return res.status(400).json('No estás autorizado rey')
  }
}

module.exports = { sameUser }
