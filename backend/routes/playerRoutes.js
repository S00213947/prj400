const express = require('express');
const mongoose = require('mongoose'); // ✅ HERE
const Player = require('../models/Player');
const { checkJwt } = require('../middleware/auth'); // 👈 import

const router = express.Router();

// ✅ Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Check if a player exists by email
router.get('/email/:email', async (req, res) => {
  try {
    const rawParam = req.params.email;
    const decodedEmail = decodeURIComponent(rawParam);
    console.log('[🧠 Checking player by email]', { rawParam, decodedEmail });

    const player = await Player.findOne({ email: decodedEmail });

    if (!player) {
      console.log('🟥 No player found with email:', decodedEmail);
      return res.status(404).json(null);
    }

    res.json(player);
  } catch (err) {
    console.error('🔥 Error in email check route:', err.message);
    res.status(500).json({ message: err.message });
  }
});



// ✅ Get a single player by ID
/* router.put('/:id', async (req, res) => {
  try {
    const updated = await Player.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    console.log('✅ Updated Player:', updated);

    if (!updated) return res.status(404).json({ message: 'Player not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}); */
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    console.error('Error fetching player:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Create a new player
router.post('/', async (req, res) => {
  const { name, role, email, password } = req.body;
  console.log('🛠️ Incoming POST /players:', { name, role, email, password });

  const newPlayer = new Player({
    name,
    role,
    email,
    password: password || '', // ✅ fallback if password not provided
    riskScores: [],
    sessions: []
  });

  try {
    const savedPlayer = await newPlayer.save();
    console.log('✅ Player created:', savedPlayer);
    res.status(201).json(savedPlayer);
  } catch (err) {
    console.error('❌ Error saving player:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Log a training session + calculate risk
router.put('/:id/training', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    const { duration, rpe, hrv } = req.body;
    const load = duration * rpe;
    const date = new Date().toISOString().split('T')[0];

    // Calculate ACWR (last 4 sessions as chronic load)
    player.sessions = player.sessions || [];
    const recent = player.sessions.slice(-4);
    const acute = recent.reduce((sum, s) => sum + (s.load || 0), 0);
    const chronic = recent.length > 0 ? acute / recent.length : 1;
    const acwr = chronic > 0 ? load / chronic : 0;

    // Calculate risk score
    let riskScore;
    if (hrv !== undefined && hrv !== null) {
      const normalizedHRV = 100 - hrv;
      riskScore = (4 * acwr) + (2 * rpe) + (1.5 * normalizedHRV / 10);
    } else {
      riskScore = (4 * acwr) + (2 * rpe);
    }

    // Save session and risk score
    player.sessions.push({
      date,
      duration,
      rpe,
      hrv,
      load,
      riskScore: Number(riskScore.toFixed(2))
    });

    player.riskScores.push(Number(riskScore.toFixed(2)));

    const updated = await player.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/risk-scores', async (req, res) => {
  try {
    const { scores } = req.body;
    const player = await Player.findByIdAndUpdate(req.params.id, { riskScores: scores }, { new: true });
    res.json(player);
  } catch (err) {
    console.error('Error updating risk scores:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Delete a player
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Player.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Player not found' });
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
