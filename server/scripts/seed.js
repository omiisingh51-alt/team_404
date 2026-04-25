const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Obstacle = require('../models/Obstacle');
const Checkpoint = require('../models/Checkpoint');

// Load env vars
dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Obstacle.deleteMany({});
    await Checkpoint.deleteMany({});

    // Create Users
    const users = await User.insertMany([
      { name: 'Maya Chen', email: 'maya@test.com', password: 'password123', accessibilityMode: 'visual', obstaclesReported: 87, treesPlanted: 24, forestsCompleted: 2, points: 2400, level: 14 },
      { name: 'James Wilson', email: 'james@test.com', password: 'password123', accessibilityMode: 'mobility', obstaclesReported: 64, treesPlanted: 18, forestsCompleted: 1, points: 1800, level: 11 },
      { name: 'Priya Patel', email: 'priya@test.com', password: 'password123', accessibilityMode: 'hearing', obstaclesReported: 52, treesPlanted: 15, forestsCompleted: 1, points: 1500, level: 9 },
    ]);

    // Create Obstacles
    await Obstacle.insertMany([
      { type: 'stairs', description: 'Steep staircase without handrails', lat: 47.6062, lng: -122.3321, reportedBy: users[0]._id, upvotes: 8, downvotes: 0 },
      { type: 'pothole', description: 'Deep pothole near crosswalk', lat: 47.6072, lng: -122.3331, reportedBy: users[1]._id, upvotes: 5, downvotes: 1 },
      { type: 'construction', description: 'Road work blocking sidewalk', lat: 47.6082, lng: -122.3341, reportedBy: users[2]._id, upvotes: 12, downvotes: 2 },
    ]);

    // Create Checkpoints
    await Checkpoint.insertMany([
      { name: 'Pioneer Square', description: 'Historic district checkpoint', lat: 47.6020, lng: -122.3340, points: 50 },
      { name: 'Pike Place', description: 'Famous market checkpoint', lat: 47.6097, lng: -122.3425, points: 75 },
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
