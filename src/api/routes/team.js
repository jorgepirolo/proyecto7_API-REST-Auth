const {
  getTeams,
  getTeamById,
  addTeam,
  updateTeam,
  deleteTeam
} = require('../controllers/team')

const teamsRouter = require('express').Router()

teamsRouter.get('/', getTeams)
teamsRouter.get('/:id', getTeamById)
teamsRouter.post('/', addTeam)
teamsRouter.put('/:id', updateTeam)
teamsRouter.delete('/:id', deleteTeam)

module.exports = teamsRouter
