// backend/models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]  // Optional: change to `String` if you're not using ObjectId
});

module.exports = mongoose.model('Team', teamSchema);
