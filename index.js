require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const userRoutes = require('./src/api/routes/user')
const teamsRouter = require('./src/api/routes/team')
const playersRouter = require('./src/api/routes/player')

const app = express()

connectDB()

app.use(express.json())

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/teams', teamsRouter)
app.use('/api/v1/players', playersRouter)

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found')
})

app.listen(3000, () => {
  console.log('El servidor está funcionando en http://localhost:3000')
})
