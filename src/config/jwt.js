const jwt = require('jsonwebtoken')

//? crear una llave
const generateSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

//? verificación si esa llave esta creada con nuestro "password"

const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generateSign, verifyJwt }
