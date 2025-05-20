const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};