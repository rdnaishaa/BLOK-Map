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
    'Taman Literasi',
    'Barito',
    'Gulai Tikungan (Mahakam)',
    'Senayan',
    'Kebayoran Baru'
];

exports.createSpot = async (spotData) => {
    try {
        const res = await db.query(
            `INSERT INTO spots (
                namaHangout, kategori, lokasi, informasiHangout
            ) VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                spotData.namaHangout,
                spotData.kategori,
                spotData.lokasi,
                spotData.informasiHangout
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
        
        query += " ORDER BY namaHangout";
        
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
        return res.rows[0];
    } catch (error) {
        console.error("Error getting spot by id:", error);
        throw error;
    }
};

exports.updateSpot = async (id, spotData) => {
    try {
        const res = await db.query(
            `UPDATE spots SET
                namaHangout = $1,
                kategori = $2,
                lokasi = $3,
                informasiHangout = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5 RETURNING *`,
            [
                spotData.namaHangout,
                spotData.kategori,
                spotData.lokasi,
                spotData.informasiHangout,
                id
            ]
        );
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

exports.getKategoriList = () => {
    return KATEGORI_CHOICES;
};

exports.getLokasiList = () => {
    return LOKASI_CHOICES;
};