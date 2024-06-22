const User = require('../api/models/user')
const { verifyJwt } = require('../config/jwt')

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json('No hay token')
    }

    const parsedToken = token.replace('Bearer ', '')
    const { id } = verifyJwt(parsedToken)
    const user = await User.findById(id)

    if (user.role === 'admin') {
      user.password = null
      req.user = user
      next()
    } else {
      return res
        .status(400)
        .json(
          'No estás autorizado para realizar estos cambios. Contacta con tu administrador.'
        )
    }
  } catch (error) {
    return res.status(400).json('No estás autorizado rey')
  }
}

module.exports = { isAdmin }
