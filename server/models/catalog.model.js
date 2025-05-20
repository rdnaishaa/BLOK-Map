const db = require("../config/pg.database");

exports.createCatalog = async (catalog) => {
  try {
    const res = await db.query(
      `INSERT INTO catalogs (
        namaKatalog, kategoriRestaurant_id, lokasi, harga, deskripsiKatalog, restaurant_id, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        catalog.namaKatalog,
        catalog.kategoriRestaurant_id,
        catalog.lokasi,
        catalog.harga,
        catalog.deskripsiKatalog,
        catalog.restaurant_id,
        catalog.image_url || null
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error creating catalog:", error);
    throw error;
  }
};

exports.getCatalogs = async (query = {}) => {
  try {
    let sqlQuery = `
      SELECT 
        c.id,
        c.namaKatalog,
        c.kategoriRestaurant_id,
        c.lokasi,
        c.harga,
        c.deskripsiKatalog,
        c.restaurant_id,
        c.image_url,
        kr.kategori as kategori_nama,
        r.namaRestaurant
      FROM catalogs c
      LEFT JOIN kategori_restaurant kr ON c.kategoriRestaurant_id = kr.id
      LEFT JOIN restaurants r ON c.restaurant_id = r.id
    `;
    
    const values = [];
    const res = await db.query(sqlQuery, values);
    return res.rows;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
};

exports.getCatalogById = async (id) => {
  try {
    const res = await db.query(
      `SELECT 
        c.*,
        kr.kategori AS kategori_nama,
        r.namaRestaurant
      FROM catalogs c
      LEFT JOIN kategori_restaurant kr ON c.kategoriRestaurant_id = kr.id
      LEFT JOIN restaurants r ON c.restaurant_id = r.id
      WHERE c.id = $1`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error fetching catalog by id:", error);
    throw error;
  }
};

exports.updateCatalogFields = async (id, fields) => {
  try {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(fields)) {
      updateFields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    values.push(id); // Add the ID as the last parameter

    const query = `
      UPDATE catalogs
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *`;

    const res = await db.query(query, values);

    if (res.rows.length === 0) return null; // If no rows are updated, return null
    return res.rows[0]; // Return the updated catalog
  } catch (error) {
    console.error("Error updating catalog fields:", error);
    throw error;
  }
};

exports.deleteCatalog = async (id) => {
  try {
    const res = await db.query(
      "DELETE FROM catalogs WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error deleting catalog:", error);
    throw error;
  }
};