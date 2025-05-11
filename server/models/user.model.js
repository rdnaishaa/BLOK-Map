
const db = require("../config/pg.database");

exports.registerUser = async (user) => {
    const hashed_password = bcrypt.hashSync(user.hashed_password, 10);
    const { username, email, role, first_name, last_name } = user;
    try {
        const res = await db.query(
            `INSERT INTO users (username, email, hashed_password, role, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [username, email, hashed_password, role, first_name, last_name]
        );
        return res.rows[0]; 
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

exports.loginUser = async (email, hashed_password) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE email = $1 AND hashed_password = $2",
            [email, hashed_password]
        );

        if (res.rows.length === 0) return null;
        return res.rows[0];
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
