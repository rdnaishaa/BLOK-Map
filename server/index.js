const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { pool } = require('./config/pg.database');

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
app.use('/auth', require('./routes/auth.route'));
app.use('/reviews', require('./routes/review.route'));
app.use('/articles', require('./routes/articles.route'));
app.use('/places', require('./routes/places.route'));
app.use('/catalogs', require('./routes/catalog.route')); 

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to BlokMap API!');
});

// connect server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
