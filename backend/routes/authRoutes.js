const express = require('express');
const bcrypt = require('bcrypt');
const Player = require('../models/Player');
const Coach = require('../models/Coach');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (role === 'player') {
      newUser = new Player({ name, email, password: hashedPassword, role });
    } else if (role === 'coach') {
      newUser = new Coach({ name, email, password: hashedPassword });
    } else {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

module.exports = router;
