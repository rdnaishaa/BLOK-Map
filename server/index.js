const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { pool } = require('./config/pg.database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://blok-map.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Connect to PostgreSQL
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

// Routes
app.use('/auth', require('./routes/auth.route'));
app.use('/reviews', require('./routes/review.route'));
app.use('/articles', require('./routes/articles.route'));
app.use('/restaurant', require('./routes/restaurant.route'));
app.use('/spots', require('./routes/spot.route'));
app.use('/catalogs', require('./routes/catalog.route')); 

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to BlokMap API!');
});

// connect server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
