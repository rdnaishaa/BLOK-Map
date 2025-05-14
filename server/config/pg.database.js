require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

cloudinary.config({
  connectionString: process.env.CLOUDINARY_URL,
  }
);

const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("Error executing query", error);
  }
};

module.exports = {
  pool,
  query,
  cloudinary,
};