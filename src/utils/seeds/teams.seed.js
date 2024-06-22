require('dotenv').config()
const mongoose = require('mongoose')
const Team = require('../../api/models/team')
const { teams } = require('../../data/teams')

const lanzarSemilla = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)

    await Team.collection.drop()
    console.log('Equipos eliminados')

    await Team.collection.insertMany(teams)
    console.log('Equipos incluidos')

    await mongoose.disconnect()
    console.log('Desconectado de la BBDD')
  } catch (error) {
    console.log('Error al plantar la semilla 🪴❌')
  }
}

lanzarSemilla()
