const db = require("../config/pgDatabase");

const KATEGORI_CHOICES = [
  'Atraksi',
  'Tempat Nongkrong',
  'Entertainment',
  'Refleksi',
  'Rohani',
  'Family Friendly'
];

const LOKASI_CHOICES = [
  'Blok-M Square',
  'Plaza Blok-M',
  'Melawai',
  'Sambas',
  'Taman Literasi',
  'Bekas Stasiun Blok-M',
  'Gulai Tikungan (Mahakam)'
];

exports.createSpot = async (spot, image) => {
  try {
    let imageUrl = null;
    if (image) {
      const uploadResponse = await db.cloudinary.uploader.upload(image.path);
      imageUrl = uploadResponse.secure_url;
    }
    
    const res = await db.query(
      `INSERT INTO spots (
        namaHangout, kategori, lokasi, informasiHangout, 
        price, image_url, type, artikel
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        spot.namaHangout,
        spot.kategori,
        spot.lokasi,
        spot.informasiHangout,
        spot.price,
        imageUrl,
        spot.type || 'Tempat Nongkrong',
        spot.artikel
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error creating spot:", error);
    throw error;
  }
};

exports.getAllSpots = async (queryParams) => {
  try {
    const { search, kategori, lokasi, page = 1, limit = 12 } = queryParams;
    const offset = (page - 1) * limit;
    
    let query = "SELECT * FROM spots";
    const conditions = [];
    const params = [];
    
    if (search) {
      conditions.push(`(namaHangout ILIKE $${params.length + 1} OR informasiHangout ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    
    if (kategori) {
      conditions.push(`kategori = $${params.length + 1}`);
      params.push(kategori);
    }
    
    if (lokasi) {
      conditions.push(`lokasi = $${params.length + 1}`);
      params.push(lokasi);
    }
    
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    
    query += " ORDER BY namaHangout ASC";
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
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
      "SELECT * FROM spots WHERE id = $1",
      [id]
    );
    
    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (error) {
    console.error("Error getting spot by id:", error);
    throw error;
  }
};

exports.getKategoriList = async () => {
  try {
    return KATEGORI_CHOICES;
  } catch (error) {
    console.error("Error getting kategori list:", error);
    throw error;
  }
};

exports.getLokasiList = async () => {
  try {
    return LOKASI_CHOICES;
  } catch (error) {
    console.error("Error getting lokasi list:", error);
    throw error;
  }
};

exports.updateSpot = async (id, spotData, image) => {
  try {
    let imageUrl = spotData.image_url;
    if (image) {
      const uploadResponse = await db.cloudinary.uploader.upload(image.path);
      imageUrl = uploadResponse.secure_url;
    }
    
    const res = await db.query(
      `UPDATE spots SET
        namaHangout = $1,
        kategori = $2,
        lokasi = $3,
        informasiHangout = $4,
        price = $5,
        image_url = $6,
        type = $7,
        artikel = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *`,
      [
        spotData.namaHangout,
        spotData.kategori,
        spotData.lokasi,
        spotData.informasiHangout,
        spotData.price,
        imageUrl,
        spotData.type,
        spotData.artikel,
        id
      ]
    );
    
    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (error) {
    console.error("Error updating spot:", error);
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