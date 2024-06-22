const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('Conectado a la BBDD 😎')
  } catch (error) {
    console.log('No te has conectado a la BBDD ☠️')
  }
}

module.exports = { connectDB }
