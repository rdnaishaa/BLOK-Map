const db = require("../config/pg.database");

exports.createSpot = async (spotData) => {
    try {
        const res = await db.query(
            `INSERT INTO spots (
                namaTempat, kategoriSpot_id, lokasi, rating, price
            ) VALUES (
                $1,
                (SELECT id FROM kategori_spot WHERE kategori = $2),
                $3,
                $4,
                $5
            ) RETURNING *`,
            [
                spotData.namaTempat,
                spotData.kategori,
                spotData.lokasi,
                spotData.rating,
                spotData.price
            ]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error creating spot:", error);
        throw error;
    }
};

exports.getSpots = async ({ search, kategori, lokasi }) => {
    try {
        let query = `
        SELECT 
            s.id,
            s.namaTempat,    // Pastikan nama field sesuai dengan database
            s.lokasi,
            s.rating,
            s.image_url,     // Tambahkan field image_url jika ada
            ks.kategori as kategori_nama
        FROM spots s
        LEFT JOIN kategori_spot ks ON s.kategoriSpot_id = ks.id
        `;
        const conditions = [];
        const params = [];

        if (search) {
            conditions.push(`s.namaTempat ILIKE $${params.length + 1}`);
            params.push(`%${search}%`);
        }

        if (kategori) {
            conditions.push(`ks.kategori = $${params.length + 1}`);
            params.push(kategori);
        }

        if (lokasi) {
            conditions.push(`s.lokasi = $${params.length + 1}`);
            params.push(lokasi);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY s.namaTempat";

        const res = await db.query(query, params);
        return res.rows;
    } catch (error) {
        console.error("Error getting spots:", error);
        throw error;
    }
};

exports.getSpotById = async (id) => {
    try {
        const res = await db.query(
            `
            SELECT s.*, ks.kategori AS kategori
            FROM spots s
            JOIN kategori_spot ks ON s.kategoriSpot_id = ks.id
            WHERE s.id = $1
            `,
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error getting spot by id:", error);
        throw error;
    }
};

exports.updateSpotFields = async (id, fields) => {
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
      UPDATE spots
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *`;

    const res = await db.query(query, values);

    if (res.rows.length === 0) return null; // If no rows are updated, return null
    return res.rows[0]; // Return the updated spot
  } catch (error) {
    console.error("Error updating spot fields:", error);
    throw error;
  }
};

exports.deleteSpot = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM spots WHERE id = $1 RETURNING *",
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error deleting spot:", error);
        throw error;
    }
};

exports.getKategoriList = async () => {
    try {
        const res = await db.query("SELECT * FROM kategori_spot ORDER BY kategori ASC");
        return res.rows;
    } catch (error) {
        console.error("Error getting kategori list:", error);
        throw error;
    }
};

exports.getLokasiList = async () => {
    try {
        const res = await db.query(
            `SELECT DISTINCT lokasi FROM spots ORDER BY lokasi ASC`
        );
        return res.rows.map(row => row.lokasi);
    } catch (error) {
        console.error("Error getting lokasi list:", error);
        throw error;
    }
};