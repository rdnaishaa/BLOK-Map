const pool = require('../config/pg.database');

const ReviewModel = {
  // Get all reviews by category
  async getAllByCategory(category, id) {
    const validCategories = ['spot', 'cafe', 'resto'];
    if (!validCategories.includes(category)) {
      throw new Error('Invalid category');
    }

    const column = `${category}_id`;
    const query = `SELECT * FROM reviews WHERE ${column} = $1 ORDER BY created_at DESC`;
    try {
      return await pool.query(query, [id]);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get a single review by ID
  async getById(id) {
    const query = 'SELECT * FROM reviews WHERE id = $1';
    try {
      return await pool.query(query, [id]);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Create a new review
  async create({ user_id, content, rating, spot_id, cafe_id, resto_id }) {
    const query = `INSERT INTO reviews (user_id, content, rating, spot_id, cafe_id, resto_id)
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING *`;
    try {
      return await pool.query(query, [user_id, content, rating, spot_id, cafe_id, resto_id]);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update an existing review
  async update(id, { content, rating }) {
    const query = `UPDATE reviews SET content = $1, rating = $2, updated_at = NOW()
                   WHERE id = $3 RETURNING *`;
    try {
      return await pool.query(query, [content, rating, id]);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Delete a review
  async delete(id) {
    const query = 'DELETE FROM reviews WHERE id = $1';
    try {
      await pool.query(query, [id]);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Set status
  async updateStatus(id, status) {
    return pool.query(
      'UPDATE reviews SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
  },

// Optional: admin edit content & rating
  async adminEdit(id, { content, rating }) {
    return pool.query(
      `UPDATE reviews SET content = $1, rating = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [content, rating, id]
    );
  },
};

module.exports = ReviewModel;
