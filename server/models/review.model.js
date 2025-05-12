const pool = require('../config/pg.database');

const ReviewModel = {
  async getAllByPlace(places_id) {
    const query = `SELECT * FROM reviews WHERE places_id = $1 ORDER BY created_at DESC`;
    try {
      const result = await pool.query(query, [places_id]);
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  
  async create({ user_id, content, rating, places_id }) {
    const query = `INSERT INTO reviews (user_id, content, rating, places_id)
                   VALUES ($1, $2, $3, $4)
                   RETURNING *`;
    try {
      return await pool.query(query, [user_id, content, rating, places_id]);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async update(id, { content, rating }) {
    const query = `UPDATE reviews SET content = $1, rating = $2
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
};
module.exports = ReviewModel;
