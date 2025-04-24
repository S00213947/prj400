const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },

  pendingPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],


  //  Coaches can manage multiple teams
  teams: [{
    name: String,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
  }],

  // Optional future additions
  // messages: [{ type: String }],
  // createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coach', CoachSchema);
