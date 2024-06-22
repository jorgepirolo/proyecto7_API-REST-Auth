const { generateSign } = require('../../config/jwt')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const register = async (req, res, next) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      role: 'user'
    })

    const emailDuplicated = await User.findOne({ email: req.body.email })

    if (emailDuplicated) {
      return res
        .status(400)
        .json('El email que has indicado ya está registrado')
    }

    const userSaved = await newUser.save()

    return res.status(201).json(userSaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //! lo que pasa cuando te logueas con jsonwebtoken
        const token = generateSign(user._id)

        return res.status(200).json({ user, token })
      } else {
        return res.status(400).json('El email o el password son incorrectos')
      }
    } else {
      return res.status(400).json('El email o el password son incorrectos')
    }
  } catch (error) {
    return res.status(400).json(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const userDeleted = await User.findByIdAndDelete(id)
    return res.status(200).json({
      mensaje: 'Usuario eliminado',
      userDeleted
    })
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const newRole = req.body
    const userUpdated = await User.findByIdAndUpdate(id, newRole, {
      new: true,
      runValidators: true
    })
    return res.status(200).json(userUpdated)
  } catch (error) {
    return res.status(400).json(error)
  }
}

module.exports = { register, login, deleteUser, getUsers, updateUser }
