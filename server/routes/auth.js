const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, accessibilityMode } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, accessibilityMode });
    res.status(201).json({
      user: {
        _id: user._id, name: user.name, email: user.email,
        accessibilityMode: user.accessibilityMode,
        obstaclesReported: user.obstaclesReported,
        treesPlanted: user.treesPlanted,
        forestsCompleted: user.forestsCompleted,
        points: user.points, level: user.level,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id, name: user.name, email: user.email,
          accessibilityMode: user.accessibilityMode,
          obstaclesReported: user.obstaclesReported,
          treesPlanted: user.treesPlanted,
          forestsCompleted: user.forestsCompleted,
          points: user.points, level: user.level,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user from token
// @access  Private
const { protect } = require('../middleware/auth');
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
