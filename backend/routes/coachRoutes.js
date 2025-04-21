const express = require('express');
const Coach = require('../models/Coach');
const router = express.Router();


// ✅ Create a new coach (used in Auth0 login callback)
router.post('/', async (req, res) => {
    try {
      const { name, email, role, password } = req.body;
  
      const existing = await Coach.findOne({ email });
      if (existing) return res.status(409).json({ message: 'Coach already exists' });
  
      const coach = new Coach({ name, email, role, password });
      await coach.save();
  
      res.status(201).json(coach);
    } catch (err) {
      console.error('❌ Error creating coach:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const coach = await Coach.findById(req.params.id);
      if (!coach) {
        return res.status(404).json({ message: 'Coach not found' });
      }
      res.json(coach);
    } catch (err) {
      console.error('❌ Error fetching coach by ID:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  router.get('/email/:email', async (req, res) => {
    const decodedEmail = decodeURIComponent(req.params.email);
  
    try {
      const coach = await Coach.findOne({ email: decodedEmail });
      if (!coach) {
        return res.status(404).json({ message: 'Coach not found' });
      }
  
      res.json(coach);
    } catch (err) {
      console.error('❌ Error fetching coach by email:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// ✅ Add player to a coach's team using email
router.put('/:coachId/teams/:teamName/add-player-by-email', async (req, res) => {
  const { playerEmail } = req.body;
  const { coachId, teamName } = req.params;

  try {
    const coach = await Coach.findById(coachId);
    if (!coach) return res.status(404).json({ message: 'Coach not found' });

    const team = coach.teams.find(t => t.name === teamName);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (!team.players.includes(playerEmail)) {
      team.players.push(playerEmail);
      await coach.save();
    }

    res.json({ message: '✅ Player added to team', team });
  } catch (err) {
    console.error('❌ Error adding player by email:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:coachId/pending-players', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.coachId).populate('pendingPlayers');
    if (!coach) return res.status(404).json({ message: 'Coach not found' });
    res.json(coach.pendingPlayers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:coachId/add-player/:playerId', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.coachId);
    if (!coach) return res.status(404).json({ message: 'Coach not found' });

    if (!coach.pendingPlayers.includes(req.params.playerId)) {
      coach.pendingPlayers.push(req.params.playerId);
      await coach.save();
    }

    res.json({ message: 'Player added to pending list', pendingPlayers: coach.pendingPlayers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /coaches/:coachId/remove-player/:playerId
router.delete('/:coachId/remove-player/:playerId', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.coachId);
    if (!coach) return res.status(404).json({ message: 'Coach not found' });

    coach.pendingPlayers = coach.pendingPlayers.filter(
      id => id.toString() !== req.params.playerId
    );

    await coach.save();
    res.json({ message: '✅ Player removed from pending list' });
  } catch (err) {
    console.error('❌ Error removing player:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ PUT /coaches/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCoach = await Coach.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCoach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json(updatedCoach);
  } catch (error) {
    console.error('Error updating coach:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Optional: Create a new team
router.post('/:coachId/teams', async (req, res) => {
  const { name } = req.body;

  try {
    const coach = await Coach.findById(req.params.coachId);
    if (!coach) return res.status(404).json({ message: 'Coach not found' });

    const existing = coach.teams.find(t => t.name === name);
    if (existing) return res.status(409).json({ message: 'Team name already exists' });

    coach.teams.push({ name, players: [] });
    await coach.save();

    res.status(201).json({ message: '✅ Team created', teams: coach.teams });
  } catch (err) {
    console.error('❌ Error creating team:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Optional: Get a coach's teams
router.get('/:coachId/teams', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.coachId);
    if (!coach) return res.status(404).json({ message: 'Coach not found' });

    res.json(coach.teams);
  } catch (err) {
    console.error('❌ Error getting teams:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
