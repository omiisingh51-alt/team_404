const mongoose = require('mongoose');

const obstacleSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['pothole', 'stairs', 'construction', 'narrow_path', 'other'] },
  description: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  resolved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Obstacle', obstacleSchema);
