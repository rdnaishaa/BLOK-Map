const db = require("../config/pg.database");

exports.createPlace = async (placeData) => {
    try {
        const res = await db.query(
            `INSERT INTO places (
                namaTempat, kategori_id, lokasi, rating, price
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                placeData.namaTempat,
                placeData.kategori_id,
                placeData.lokasi,
                placeData.rating,
                placeData.price
            ]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error creating place:", error);
        throw error;
    }
};

exports.getPlaces = async ({ search, kategori_id, lokasi }) => {
    try {
        let query = "SELECT * FROM places";
        const conditions = [];
        const params = [];

        if (search) {
            conditions.push(`namaTempat ILIKE $${params.length + 1}`);
            params.push(`%${search}%`);
        }

        if (kategori_id) {
            conditions.push(`kategori_id = $${params.length + 1}`);
            params.push(kategori_id);
        }

        if (lokasi) {
            conditions.push(`lokasi = $${params.length + 1}`);
            params.push(lokasi);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY namaTempat";

        const res = await db.query(query, params);
        return res.rows;
    } catch (error) {
        console.error("Error getting places:", error);
        throw error;
    }
};

exports.getPlaceById = async (id) => {
    try {
        const res = await db.query(
            "SELECT * FROM places WHERE id = $1",
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error getting place by id:", error);
        throw error;
    }
};

exports.updatePlace = async (id, placeData) => {
    try {
        const res = await db.query(
            `UPDATE places SET
                namaTempat = $1,
                kategori_id = $2,
                lokasi = $3,
                rating = $4,
                price = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6 RETURNING *`,
            [
                placeData.namaTempat,
                placeData.kategori_id,
                placeData.lokasi,
                placeData.rating,
                placeData.price,
                id
            ]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error updating place:", error);
        throw error;
    }
};

exports.deletePlace = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM places WHERE id = $1 RETURNING *",
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error deleting place:", error);
        throw error;
    }
};