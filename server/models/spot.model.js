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
                s.*,
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

exports.updateSpot = async (id, spotData) => {
    try {
        const res = await db.query(
            `UPDATE spots SET
                namaTempat = $1,
                kategoriSpot_id = (SELECT id FROM kategori_spot WHERE kategori = $2),
                lokasi = $3,
                rating = $4,
                price = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6 RETURNING *`,
            [
                spotData.namaTempat,
                spotData.kategori,
                spotData.lokasi,
                spotData.rating,
                spotData.price,
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