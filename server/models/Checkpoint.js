const mongoose = require('mongoose');

const checkpointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  points: { type: Number, default: 50 },
  discoveredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Checkpoint', checkpointSchema);
