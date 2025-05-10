// server/models/review.model.js
const pool = require('../config/pg.database');

const ReviewModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create({ user_id, type, item_id, rating, review_text }) {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, type, item_id, rating, review_text)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, type, item_id, rating, review_text]
    );
    return result.rows[0];
  },

  async update(id, { rating, review_text }) {
    const result = await pool.query(
      `UPDATE reviews SET rating = $1, review_text = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [rating, review_text, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
  }
};

module.exports = ReviewModel;
