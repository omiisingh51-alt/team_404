const express = require('express');
const router = express.Router();
const Obstacle = require('../models/Obstacle');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/obstacles
// @desc    Get obstacles near a location
router.get('/', async (req, res) => {
  try {
    const obstacles = await Obstacle.find({ resolved: false }).sort('-createdAt').limit(50);
    res.json(obstacles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/obstacles
// @desc    Report a new obstacle
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { type, description, lat, lng } = req.body;
    const obstacle = await Obstacle.create({
      type, description, lat, lng, reportedBy: req.user.id,
    });
    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { obstaclesReported: 1, points: 10 },
    });
    res.status(201).json(obstacle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/obstacles/:id/vote
// @desc    Vote on an obstacle
router.put('/:id/vote', async (req, res) => {
  try {
    const { voteType } = req.body;
    const update = voteType === 'up' ? { $inc: { upvotes: 1 } } : { $inc: { downvotes: 1 } };
    const obstacle = await Obstacle.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(obstacle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/obstacles/:id/resolve
// @desc    Mark obstacle as resolved
router.put('/:id/resolve', async (req, res) => {
  try {
    const obstacle = await Obstacle.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
    res.json(obstacle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
