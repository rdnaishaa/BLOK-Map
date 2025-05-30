const db = require("../config/pg.database");

exports.createRestaurant = async (restaurantData) => {
    try {
        const res = await db.query(
            `INSERT INTO restaurants (
                namaRestaurant, kategoriRestaurant_id, lokasi, rating, price, informasiRestaurant
            ) VALUES (
                $1,
                (SELECT id FROM kategori_restaurant WHERE kategori = $2),
                $3,
                $4,
                $5,
                $6
            ) RETURNING *`,
            [
                restaurantData.namaRestaurant,
                restaurantData.kategori,
                restaurantData.lokasi,
                restaurantData.rating,
                restaurantData.price,
                restaurantData.informasiRestaurant
            ]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error creating restaurant:", error);
        throw error;
    }
};

exports.getRestaurants = async ({ search, kategori, lokasi }) => {
    try {
        let query = `
            SELECT 
                r.id,
                r.namaRestaurant,
                r.lokasi,
                r.rating,
                r.price,
                r.informasiRestaurant,
                kr.kategori as kategori_nama
            FROM restaurants r
            LEFT JOIN kategori_restaurant kr ON r.kategoriRestaurant_id = kr.id
        `;
        const conditions = [];
        const params = [];

        if (search) {
            conditions.push(`r.namaRestaurant ILIKE $${params.length + 1}`);
            params.push(`%${search}%`);
        }

        if (kategori) {
            conditions.push(`kr.kategori = $${params.length + 1}`);
            params.push(kategori);
        }

        if (lokasi) {
            conditions.push(`r.lokasi = $${params.length + 1}`);
            params.push(lokasi);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY r.namaRestaurant";

        const res = await db.query(query, params);
        return res.rows;
    } catch (error) {
        console.error("Error getting restaurants:", error);
        throw error;
    }
};

exports.getRestaurantById = async (id) => {
    try {
        const res = await db.query(
            `
            SELECT r.*, kr.kategori AS kategori
            FROM restaurants r
            JOIN kategori_restaurant kr ON r.kategoriRestaurant_id = kr.id
            WHERE r.id = $1
            `,
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error getting restaurant by id:", error);
        throw error;
    }
};

exports.updateRestaurantFields = async (id, fields) => {
  try {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    // Dynamically build the query based on provided fields
    for (const [key, value] of Object.entries(fields)) {
      updateFields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    values.push(id); // Add the ID as the last parameter

    const query = `
      UPDATE restaurants
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *`;

    const res = await db.query(query, values);

    if (res.rows.length === 0) return null; // If no rows are updated, return null
    return res.rows[0]; // Return the updated restaurant
  } catch (error) {
    console.error("Error updating restaurant fields:", error);
    throw error;
  }
};

exports.deleteRestaurant = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM restaurants WHERE id = $1 RETURNING *",
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        throw error;
    }
};