const pool = require('../config/pg.database');

const ReviewModel = {
  async getAll() {
    const query = `
      SELECT
        r.id,
        r.user_id,
        r.rating,
        r.content,
        r.created_at,
        r.spot_id,
        r.resto_id,
        u.username,
        s.namatempat as spot_name,
        rest.namarestaurant as restaurant_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN spots s ON r.spot_id = s.id
      LEFT JOIN restaurants rest ON r.resto_id = rest.id
    `;
    try {
      const result = await pool.query(query);
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

  async updateReviewFields(id, fields) {
    try {
      const allowedFields = ['content', 'rating'];
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(fields)) {
        if (allowedFields.includes(key)) {
          updateFields.push(`${key} = $${paramCount}`);
          // Pastikan rating dikirim sebagai number
          values.push(key === 'rating' ? Number(value) : value);
          paramCount++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields provided for update');
      }

      // Tambahkan updated_at
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

      values.push(id); // Add the ID as the last parameter

      const query = `
        UPDATE reviews
        SET ${updateFields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING *`;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) return null;
      return result.rows[0];
    } catch (error) {
      console.error("Error updating review fields:", error);
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
  },

  async getByRestaurantId(restaurantId) {
    const query = `
      SELECT 
        r.id,
        r.user_id,
        r.rating,
        r.content,
        r.created_at,
        u.username,
        rest.namarestaurant as restaurant_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN restaurants rest ON r.resto_id = rest.id
      WHERE r.resto_id = $1
      ORDER BY r.created_at DESC
    `;
    try {
      const result = await pool.query(query, [restaurantId]);
      return result.rows;
    } catch (error) {
      console.error("Error fetching reviews by restaurant id:", error);
      throw new Error(error.message);
    }
  },

  async getBySpotId(spotId) {
    const query = `
      SELECT 
        r.id,
        r.user_id,
        r.rating,
        r.content,
        r.created_at,
        u.username,
        s.namatempat as spot_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN spots s ON r.spot_id = s.id
      WHERE r.spot_id = $1
      ORDER BY r.created_at DESC
    `;
    try {
      const result = await pool.query(query, [spotId]);
      return result.rows;
    } catch (error) {
      console.error("Error fetching reviews by spot id:", error);
      throw new Error(error.message);
    }
  },

};

module.exports = ReviewModel;