const express = require('express');
const Player = require('../models/Player'); // ✅ Import Player model
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

// ✅ Get a single player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Create a new player
router.post('/', async (req, res) => {
  const { name, role, email, password } = req.body;

  const newPlayer = new Player({ name, role, email, password, riskScores: [] });

  try {
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT: Update player training data & risk scores
router.put('/:id/training', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    player.trainingHours = req.body.trainingHours || player.trainingHours;
    player.recoveryTime = req.body.recoveryTime || player.recoveryTime;
    player.riskScores.push(Math.random() * 5); // Example risk calculation

    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE: Remove a player
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) return res.status(404).json({ message: 'Player not found' });
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
