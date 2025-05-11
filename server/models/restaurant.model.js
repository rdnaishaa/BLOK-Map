const db = require("../config/pgDatabase");

const KATEGORI_CHOICES = [
    'Sweetness Overload',
    'Umami-rich',
    'Fine Dining',
    'Amigos (Agak MInggir GOt Sedikit)',
    'Sip and savor',
    'Brew Coffee'
];

const LOKASI_CHOICES = [
    'Blok-M Square',
    'Plaza Blok-M',
    'Melawai',
    'Taman Literasi',
    'Barito',
    'Gulai Tikungan (Mahakam)',
    'Senayan',
    'Kebayoran Baru'
];

exports.createRestaurant = async (restaurantData) => {
    try {
        const res = await db.query(
            `INSERT INTO restaurants (
                namaRestaurant, kategori, lokasi, informasiRestaurant
            ) VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                restaurantData.namaRestaurant,
                restaurantData.kategori,
                restaurantData.lokasi,
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
        
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
        
        query += " ORDER BY namaRestaurant";
        
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
        return res.rows[0];
    } catch (error) {
        console.error("Error getting restaurant by id:", error);
        throw error;
    }
};

exports.updateRestaurant = async (id, restaurantData) => {
    try {
        const res = await db.query(
            `UPDATE restaurants SET
                namaRestaurant = $1,
                kategori = $2,
                lokasi = $3,
                informasiRestaurant = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5 RETURNING *`,
            [
                restaurantData.namaRestaurant,
                restaurantData.kategori,
                restaurantData.lokasi,
                restaurantData.informasiRestaurant,
                id
            ]
        );
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

exports.getKategoriList = () => {
    return KATEGORI_CHOICES;
};

exports.getLokasiList = () => {
    return LOKASI_CHOICES;
};