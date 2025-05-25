const db = require("../config/pg.database");
const bcrypt = require('bcrypt');

exports.registerUser = async (user) => {
  const { username, email, password, first_name, last_name, role = 'user' } = user;

  try {
    const hashed_password = await bcrypt.hash(password, 10);

    const res = await db.query(
      `INSERT INTO users 
        (username, email, password_hash, role, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [username, email, hashed_password, role, first_name, last_name]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

exports.getOrCreateAdmin = async () => {
  try {
    let admin = await this.getUserByEmail(ADMIN_CREDENTIALS.email);
    if (!admin) {
      admin = await this.registerUser({
        username: ADMIN_CREDENTIALS.username,
        email: ADMIN_CREDENTIALS.email,
        password: ADMIN_CREDENTIALS.password,
        role: ADMIN_CREDENTIALS.role,
        first_name: 'Admin',
        last_name: 'Super'
      });
    }
    return admin;
  } catch (error) {
    console.error("Error getting or creating admin:", error);
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

exports.updateUserFields = async (id, fields) => {
  try {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    // Hash password if it's being updated
    if (fields.password) {
      fields.password_hash = await bcrypt.hash(fields.password, 10);
      delete fields.password; // Remove plain password from fields
    }

    // Dynamically build the query based on provided fields
    for (const [key, value] of Object.entries(fields)) {
      updateFields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    values.push(id); // Add the ID as the last parameter

    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, username, email, role, first_name, last_name, created_at`;

    const res = await db.query(query, values);

    if (res.rows.length === 0) return null; // If no rows are updated, return null
    return res.rows[0]; // Return the updated user
  } catch (error) {
    console.error("Error updating user fields:", error);
    throw error;
  }
};

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