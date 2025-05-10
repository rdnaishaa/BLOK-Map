const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const reviewRoutes = require('./routes/review.route');
const { pool } = require('./config/pg.database'); // Menggunakan pool

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

// Routes
app.use('/api/reviews', reviewRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to BlokMap API!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
