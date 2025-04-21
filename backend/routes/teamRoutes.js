// backend/routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// ✅ Create a new team
router.post('/', async (req, res) => {
  try {
    const { name, coachId, players } = req.body;

    const newTeam = new Team({ name, coachId, players });
    const savedTeam = await newTeam.save();

    res.status(201).json(savedTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Failed to create team' });
  }
});

// ✅ Get all teams for a coach
router.get('/coach/:coachId', async (req, res) => {
  try {
    const teams = await Team.find({ coachId: req.params.coachId });
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Add a player to a team
router.put('/:teamId/add-player', async (req, res) => {
  try {
    const { playerId } = req.body;
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.players.includes(playerId)) {
      return res.status(400).json({ message: 'Player already in team' });
    }

    team.players.push(playerId);
    await team.save();

    res.json({ message: 'Player added to team', team });
  } catch (err) {
    console.error('Error adding player:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// ✅ Get a specific team with full player data
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('players');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    console.error('Error loading team:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all teams that include a specific player
router.get('/player/:playerId', async (req, res) => {
  try {
    const teams = await Team.find({ players: req.params.playerId })
      .populate('coachId', 'email')      // to show coach email if needed
      .populate('players', 'email');     // to show teammates' emails

    res.json(teams);
  } catch (err) {
    console.error('Error fetching player teams:', err);
    res.status(500).json({ message: 'Server error fetching player teams' });
  }
});



// ✅ Remove a player from a team
router.put('/:teamId/remove-player', async (req, res) => {
  try {
    const { playerId } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.teamId,
      { $pull: { players: playerId } },
      { new: true }
    );
    res.json({ message: 'Player removed from team', team });
  } catch (err) {
    console.error('Error removing player:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
