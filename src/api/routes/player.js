const {
  getPlayers,
  getPlayerById,
  addPlayer,
  updatePlayer,
  deletePlayer,
  getPlayersByTeamId
} = require('../controllers/player')

const playersRouter = require('express').Router()

playersRouter.get('/', getPlayers)
playersRouter.get('/:id', getPlayerById)
playersRouter.get('/byteam/:id', getPlayersByTeamId)
playersRouter.post('/', addPlayer)
playersRouter.put('/:id', updatePlayer)
playersRouter.delete('/:id', deletePlayer)

module.exports = playersRouter
