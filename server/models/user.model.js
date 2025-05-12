const db = require("../config/pg.database");
const bcrypt = require('bcrypt');

exports.registerUser = async (user) => {
    const { username, email, password, role, first_name, last_name } = user;
    try {
        const hashed_password = await bcrypt.hash(password, 10);
        const res = await db.query(
            `INSERT INTO users (username, email, password_hash, role, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [username, email, hashed_password, role, first_name, last_name]
        );
        return res.rows[0]; 
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

exports.loginUser = async (email, password) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (res.rows.length === 0) return null;

        const user = res.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) return null;
        return user;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}

exports.getUserById = async (id) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );

        if (res.rows.length === 0) return null;
        return res.rows[0];
    } catch (error) {
        console.error("Error getting user by id:", error);
        throw error;
    }
}

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (res.rows.length === 0) return null;
        return res.rows[0];
    }
    catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
}

exports.updateUser = async (id, user) => {
    try {
        const { username, email, hashed_password, role, first_name, last_name } = userData;
        const res = await db.query(
            `UPDATE users SET
                username = $1,
                email = $2,
                hashed_password = $3,
                role = $4,
                first_name = $5,
                last_name = $6,
            WHERE id = $7 RETURNING *`,
            [username, email, hashed_password, role, first_name, last_name, id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

exports.deleteUser = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );

        if (res.rows.length === 0) return null;
        return res.rows[0];
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}
