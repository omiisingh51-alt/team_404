const express = require('express');
const router = express.Router();
const Checkpoint = require('../models/Checkpoint');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/checkpoints
router.get('/', async (req, res) => {
  try {
    const checkpoints = await Checkpoint.find();
    res.json(checkpoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/checkpoints/:id/discover
router.post('/:id/discover', protect, async (req, res) => {
  try {
    const checkpoint = await Checkpoint.findById(req.params.id);
    if (!checkpoint) return res.status(404).json({ message: 'Checkpoint not found' });

    if (checkpoint.discoveredBy.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already discovered' });
    }

    checkpoint.discoveredBy.push(req.user.id);
    await checkpoint.save();

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { checkpointsDiscovered: 1, points: checkpoint.points },
    });

    res.json(checkpoint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
