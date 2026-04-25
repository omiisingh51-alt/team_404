const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.accessibilityMode = req.body.accessibilityMode || user.accessibilityMode;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        accessibilityMode: updatedUser.accessibilityMode,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/me/progress
// @desc    Get current user gamification progress
// @access  Private
router.get('/me/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('obstaclesReported checkpointsDiscovered treesPlanted forestsCompleted points level');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      obstaclesReported: user.obstaclesReported,
      checkpointsDiscovered: user.checkpointsDiscovered,
      treesPlanted: user.treesPlanted,
      forestsCompleted: user.forestsCompleted,
      points: user.points,
      level: user.level,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
