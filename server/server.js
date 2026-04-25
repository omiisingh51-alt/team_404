const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/obstacles', require('./routes/obstacles'));
app.use('/api/checkpoints', require('./routes/checkpoints'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/translate', require('./routes/translate'));

app.get('/', (req, res) => {
  res.json({ message: 'SafeStep API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
