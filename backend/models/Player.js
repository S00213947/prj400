const mongoose = require('mongoose');

// ✅ Embedded schema for each training session
const SessionSchema = new mongoose.Schema({
  date: { type: String, required: true }, // ISO format e.g., '2025-03-30'
  duration: { type: Number, required: true }, // in minutes
  rpe: { type: Number, required: true },      // 1–10 scale
  hrv: { type: Number },                      // Optional HRV in ms
  load: { type: Number, required: true },     // duration * RPE
  riskScore: { type: Number, required: true } // Calculated score
});

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['player', 'coach'], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  displayName: { type: String, default: '' },


  // ✅ Store all sessions
  sessions: { type: [SessionSchema], default: [] },

  // ✅ Store risk history separately if used by frontend graph/chart
  riskScores: { type: [Number], default: [] },

  // (Optional) Summary metrics, not necessary if using sessions only
  trainingHours: { type: Number, default: 0 },
  recoveryTime: { type: Number, default: 0 }
});

module.exports = mongoose.model('Player', PlayerSchema);
