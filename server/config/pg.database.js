const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Nonaktifkan SSL
});

module.exports = { pool }; // Mengekspor pool