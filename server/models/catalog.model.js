const db = require("../config/pg.database");

exports.createCatalog = async (catalog) => {
  try {
    const res = await db.query(
      `INSERT INTO catalogs (
        namaKatalog, kategoriRestaurant_id, lokasi, harga, deskripsiKatalog, restaurant_id
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [
        catalog.namaKatalog,
        catalog.kategoriRestaurant_id,
        catalog.lokasi,
        catalog.harga,
        catalog.deskripsiKatalog,
        catalog.restaurant_id
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
        c.*,
        kr.kategori as kategori_nama,
        r.namaRestaurant
      FROM catalogs c
      LEFT JOIN kategori_restaurant kr ON c.kategoriRestaurant_id = kr.id
      LEFT JOIN restaurants r ON c.restaurant_id = r.id
    `;

    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (query.kategoriRestaurant_id) {
      conditions.push(`c.kategoriRestaurant_id = $${paramCount}`);
      values.push(query.kategoriRestaurant_id);
      paramCount++;
    }

    if (query.lokasi) {
      conditions.push(`c.lokasi = $${paramCount}`);
      values.push(query.lokasi);
      paramCount++;
    }

    if (query.minHarga) {
      conditions.push(`c.harga >= $${paramCount}`);
      values.push(query.minHarga);
      paramCount++;
    }

    if (query.maxHarga) {
      conditions.push(`c.harga <= $${paramCount}`);
      values.push(query.maxHarga);
      paramCount++;
    }

    if (conditions.length > 0) {
      sqlQuery += ` WHERE ${conditions.join(' AND ')}`;
    }

    sqlQuery += ' ORDER BY c.created_at DESC';

    const res = await db.query(sqlQuery, values);
    return res.rows;
  } catch (error) {
    console.error("Error fetching catalogs:", error);
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

exports.updateCatalog = async (id, catalogData) => {
  try {
    const res = await db.query(
      `UPDATE catalogs SET
        namaKatalog = $1,
        kategoriRestaurant_id = $2,
        lokasi = $3,
        harga = $4,
        deskripsiKatalog = $5,
        restaurant_id = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *`,
      [
        catalogData.namaKatalog,
        catalogData.kategoriRestaurant_id,
        catalogData.lokasi,
        catalogData.harga,
        catalogData.deskripsiKatalog,
        catalogData.restaurant_id,
        id
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error updating catalog:", error);
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