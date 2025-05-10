const db = require("../config/pgDatabase");

const KATEGORI_CHOICES = [
  'Sweetness Overload',
  'Umami-rich',
  'Fine Dining',
  'Amigos (Agak MInggir GOt Sedikit)',
  'Sip and savor'
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

exports.createRestaurant = async (restaurant, image) => {
  try {
    let imageUrl = null;
    if (image) {
      const uploadResponse = await db.cloudinary.uploader.upload(image.path);
      imageUrl = uploadResponse.secure_url;
    }
    
    const res = await db.query(
      `INSERT INTO restaurants (
        namaRestaurant, kategori, lokasi, informasiRestaurant, 
        price, image_url, type, artikel
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        restaurant.namaRestaurant,
        restaurant.kategori,
        restaurant.lokasi,
        restaurant.informasiRestaurant,
        restaurant.price,
        imageUrl,
        restaurant.type || 'restaurant',
        restaurant.artikel
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error creating restaurant:", error);
    throw error;
  }
};

exports.getAllRestaurants = async (queryParams) => {
  try {
    const { search, kategori, lokasi, type, page = 1, limit = 12 } = queryParams;
    const offset = (page - 1) * limit;
    
    let query = "SELECT * FROM restaurants";
    const conditions = [];
    const params = [];
    
    if (search) {
      conditions.push(`(namaRestaurant ILIKE $${params.length + 1} OR informasiRestaurant ILIKE $${params.length + 1})`);
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
    
    if (type) {
      conditions.push(`type = $${params.length + 1}`);
      params.push(type);
    }
    
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    
    query += " ORDER BY namaRestaurant ASC";
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
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
      "SELECT * FROM restaurants WHERE id = $1",
      [id]
    );
    
    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (error) {
    console.error("Error getting restaurant by id:", error);
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

exports.updateRestaurant = async (id, restaurantData, image) => {
  try {
    let imageUrl = restaurantData.image_url;
    if (image) {
      const uploadResponse = await db.cloudinary.uploader.upload(image.path);
      imageUrl = uploadResponse.secure_url;
    }
    
    const res = await db.query(
      `UPDATE restaurants SET
        namaRestaurant = $1,
        kategori = $2,
        lokasi = $3,
        informasiRestaurant = $4,
        price = $5,
        image_url = $6,
        type = $7,
        artikel = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *`,
      [
        restaurantData.namaRestaurant,
        restaurantData.kategori,
        restaurantData.lokasi,
        restaurantData.informasiRestaurant,
        restaurantData.price,
        imageUrl,
        restaurantData.type,
        restaurantData.artikel,
        id
      ]
    );
    
    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (error) {
    console.error("Error updating restaurant:", error);
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