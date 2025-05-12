const db = require("../config/pg.database");

exports.createCatalog = async (catalog) => {
  try {
    const res = await db.query(
      `INSERT INTO catalogs (
        namaKatalog, kategori_id, lokasi, places_id, harga, rating, deskripsiKatalog
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        catalog.namaKatalog,
        catalog.kategori_id,
        catalog.lokasi,
        catalog.places_id,
        catalog.harga,
        catalog.rating,
        catalog.deskripsiKatalog
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error creating catalog:", error);
    throw error;
  }
};

exports.getCatalogs = async (query) => {
  try {
    const conditions = [];
    const values = [];

    if (query.kategori_id) {
      conditions.push("kategori_id = $1");
      values.push(query.kategori_id);
    }

    if (query.harga) {
      conditions.push("harga BETWEEN $2 AND $3");
      values.push(query.harga.min, query.harga.max);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const res = await db.query(
      `SELECT id, kategori_id, namaKatalog, harga, rating, lokasi 
       FROM catalogs ${whereClause}`,
      values
    );

    return res.rows;
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    throw error;
  }
};

exports.getCatalogByKategori = async (kategori) => {
  try {
    const res = await db.query(
      `SELECT id, kategori_id, namaKatalog, rating, lokasi, deskripsiKatalog, harga 
       FROM catalogs WHERE kategori_id = $1`,
      [kategori]
    );

    if (res.rows.length === 0) return [];
    return res.rows;
  } catch (error) {
    console.error("Error fetching catalogs by kategori:", error);
    throw error;
  }
};

exports.getCatalogByPrice = async (min, max) => {
  try {
    const res = await db.query(
      `SELECT id, kategori_id, namaKatalog, rating, lokasi, deskripsiKatalog, harga 
       FROM catalogs WHERE harga BETWEEN $1 AND $2`,
      [min, max]
    );

    if (res.rows.length === 0) return [];
    return res.rows;
  } catch (error) {
    console.error("Error fetching catalogs by price:", error);
    throw error;
  }
};

exports.updateCatalog = async (id, catalogData) => {
  try {
    const res = await db.query(
      `UPDATE catalogs SET
        namaKatalog = $1,
        kategori_id = $2,
        lokasi = $3,
        places_id = $4,
        harga = $5,
        rating = $6,
        deskripsiKatalog = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [
        catalogData.namaKatalog,
        catalogData.kategori_id,
        catalogData.lokasi,
        catalogData.places_id,
        catalogData.harga,
        catalogData.rating,
        catalogData.deskripsiKatalog,
        id
      ]
    );

    if (res.rows.length === 0) return null;
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