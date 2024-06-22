const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    team: { type: mongoose.Types.ObjectId, ref: 'teams' }
  },
  { timestamps: true, collection: 'players' }
)

const Player = mongoose.model('players', playerSchema, 'players')

module.exports = Player
