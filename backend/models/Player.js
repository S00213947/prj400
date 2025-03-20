const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['player', 'coach'], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  riskScores: { type: [Number], default: [] },
  trainingHours: { type: Number, default: 0 },
  recoveryTime: { type: Number, default: 0 },
});

module.exports = mongoose.model('Player', PlayerSchema);
