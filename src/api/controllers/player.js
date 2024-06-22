const Player = require('../models/player')

const addPlayer = async (req, res, next) => {
  try {
    const newPlayer = new Player(req.body)
    const playerSaved = await newPlayer.save()
    return res.status(201).json(playerSaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getPlayers = async (req, res, next) => {
  try {
    const players = await Player.find().populate('team')
    return res.status(200).json(players)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getPlayerById = async (req, res, next) => {
  try {
    const { id } = req.params
    const player = await Player.findById(id).populate('team')
    return res.status(200).json(player)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const getPlayersByTeamId = async (req, res, next) => {
  try {
    const { id } = req.params
    const players = await Player.find({ team: id }).populate('team')
    return res.status(200).json(players)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const updatePlayer = async (req, res, next) => {
  try {
    const { id } = req.params
    const newPlayer = new Player(req.body)
    newPlayer._id = id

    const playerUpdated = await Player.findByIdAndUpdate(id, newPlayer, {
      new: true
    })

    return res.status(200).json(playerUpdated)
  } catch (error) {
    return res.status(400).json(error)
  }
}

const deletePlayer = async (req, res, next) => {
  try {
    const { id } = req.params
    const playerDeleted = await Player.findByIdAndDelete(id)
    return res.status(200).json({
      message: 'Jugador eliminado',
      elemento: playerDeleted
    })
  } catch (error) {
    return res.status(400).json(error)
  }
}

module.exports = {
  addPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  getPlayersByTeamId
}
