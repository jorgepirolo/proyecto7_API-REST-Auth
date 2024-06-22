const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    trophies: { type: Number }
  },
  {
    timestamps: true,
    collection: 'teams'
  }
)

const Team = mongoose.model('teams', teamSchema, 'teams')

module.exports = Team
