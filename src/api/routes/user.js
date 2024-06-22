const { isAdmin } = require('../../middlewares/admin')
const { isAuth } = require('../../middlewares/auth')
const { sameUser } = require('../../middlewares/sameUser')
const {
  register,
  getUsers,
  login,
  deleteUser,
  updateUser
} = require('../controllers/user')

const userRoutes = require('express').Router()

userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.get('/', [isAuth], getUsers)
userRoutes.delete('/:id', [sameUser], [isAdmin], deleteUser)
userRoutes.put('/:id', [isAdmin], updateUser)

module.exports = userRoutes
