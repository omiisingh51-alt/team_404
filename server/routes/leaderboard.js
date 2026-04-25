const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('name treesPlanted forestsCompleted obstaclesReported points level accessibilityMode')
      .sort('-points')
      .limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
