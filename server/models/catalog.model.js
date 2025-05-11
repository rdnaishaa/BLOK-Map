const db = require("../config/pg.database");

exports.createCatalog = async (catalog) => {
  try {
    const res = await db.query(
      `INSERT INTO catalogs (
        namaKatalog, kategori, lokasi, namaRestaurant, harga, rating, deskripsiKatalog, informasiRestaurant
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        catalog.namaKatalog,
        catalog.kategori,
        catalog.lokasi,
        catalog.namaRestaurant,
        catalog.harga,
        catalog.rating,
        catalog.deskripsiKatalog,
        catalog.informasiRestaurant
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

    if (query.kategori) {
      conditions.push("kategori = $1");
      values.push(query.kategori);
    }

    if (query.harga) {
      conditions.push("harga BETWEEN $2 AND $3");
      values.push(query.harga.min, query.harga.max);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const res = await db.query(`SELECT id, kategori, namaKatalog, namaRestaurant, harga FROM catalogs ${whereClause}`, values);

    return res.rows;
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    throw error;
  }
};

exports.getCatalogById = async (id) => {
  try {
    const res = await db.query(
      `SELECT id, kategori, namaKatalog, rating, namaRestaurant, deskripsiKatalog, informasiRestaurant, review 
       FROM catalogs WHERE id = $1`,
      [id]
    );

    if (res.rows.length === 0) return null;
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
        kategori = $2,
        lokasi = $3,
        namaRestaurant = $4,
        harga = $5,
        rating = $6,
        deskripsiKatalog = $7,
        informasiRestaurant = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *`,
      [
        catalogData.namaKatalog,
        catalogData.kategori,
        catalogData.lokasi,
        catalogData.namaRestaurant,
        catalogData.harga,
        catalogData.rating,
        catalogData.deskripsiKatalog,
        catalogData.informasiRestaurant,
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
