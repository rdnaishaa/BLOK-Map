const pool = require('../config/pg.database');

const ReviewModel = {
  async getAllBySpot(spot_id) {
    const query = `
      SELECT 
        r.*,
        u.username,
        s.namaTempat
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN spots s ON r.spot_id = s.id
      WHERE r.spot_id = $1 
      ORDER BY r.created_at DESC
    `;
    try {
      const result = await pool.query(query, [spot_id]);
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getAllByRestaurant(resto_id) {
    const query = `
      SELECT 
        r.*,
        u.username,
        rest.namaRestaurant
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN restaurants rest ON r.resto_id = rest.id
      WHERE r.resto_id = $1 
      ORDER BY r.created_at DESC
    `;
    try {
      const result = await pool.query(query, [resto_id]);
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  
  async create({ user_id, content, rating, spot_id, resto_id }) {
    const query = `
      INSERT INTO reviews (
        user_id, content, rating, spot_id, resto_id
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [
        user_id, 
        content, 
        rating, 
        spot_id || null, 
        resto_id || null
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async update(id, { content, rating }) {
    const query = `
      UPDATE reviews 
      SET content = $1, rating = $2
      WHERE id = $3 
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [content, rating, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async delete(id) {
    const query = 'DELETE FROM reviews WHERE id = $1 RETURNING *';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getById(id) {
    const query = `
      SELECT 
        r.*,
        u.username,
        s.namaTempat as spot_name,
        rest.namaRestaurant as restaurant_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN spots s ON r.spot_id = s.id
      LEFT JOIN restaurants rest ON r.resto_id = rest.id
      WHERE r.id = $1
    `;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = ReviewModel;