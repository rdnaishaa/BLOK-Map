require('dotenv').config();
const baseResponse = require('../utils/baseResponse.util');
const userRepository = require('../models/user.model');
const jwt = require('jsonwebtoken');

const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return regex.test(password);
}

const ADMIN_CREDENTIALS = {
  email: "adminsuper@blok-m.com",
  username: "adminsuper",
  password: "blok-Mterbaik1!",
  role: "admin"
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;

    if (!username || !email || !password || !first_name || !last_name) {
      return baseResponse(res, false, 400, 'All fields are required', null);
    }

    // Validasi password
    const validatePassword = (password) => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      return regex.test(password);
    };

    if (!validatePassword(password)) {
      return baseResponse(res, false, 400, 'Password must be at least 6 characters long, include a number, and a special character', null);
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 400, 'Email already exists', null);
    }

    // Buat user dengan role default 'user'
    const newUser = await userRepository.registerUser({
      username,
      email,
      password,
      first_name,
      last_name,
      role: 'user' // Hardcoded role
    });

    // Generate JWT yang menyertakan id dan role
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      token
    };

    return baseResponse(res, true, 201, 'User registered successfully', userData);

  } catch (error) {
    console.error('Registration error:', error.message);
    return baseResponse(res, false, 500, 'Internal server error', null);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Handle admin super user login
    if (email === ADMIN_CREDENTIALS.email) {
      if (password !== ADMIN_CREDENTIALS.password) {
        return baseResponse(res, false, 401, 'Invalid credentials', null);
      }

      // Check if admin exists in DB, if not create it
      let admin = await userRepository.getUserByEmail(ADMIN_CREDENTIALS.email);
      if (!admin) {
        admin = await userRepository.registerUser({
          username: ADMIN_CREDENTIALS.username,
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password,
          role: ADMIN_CREDENTIALS.role,
          first_name: 'Admin',
          last_name: 'Super'
        });
      }

      const token = jwt.sign(
        { id: admin.id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      const userData = {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        first_name: admin.first_name,
        last_name: admin.last_name,
        token
      };

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return baseResponse(res, true, 200, 'Admin logged in successfully', userData);
    }

    const user = await userRepository.loginUser(email, password);
    if (!user) {
      return baseResponse(res, false, 401, 'Invalid email or password', null);
    }

    return baseResponse(res, true, 200, 'User logged in successfully', userData);
  } catch (error) {
    console.error('Error logging in user:', error);
    return baseResponse(res, false, 500, 'Internal server error', null);
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return baseResponse(res, true, 200, 'User logged out successfully', null);
  } catch (error) {
    console.error('Error logging out user:', error);
    return baseResponse(res, false, 500, 'Internal server error', null);
  }
}

exports.getMe = async (req, res) => {
  try {
    const user = await userRepository.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.updateUserFields = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body; // Fields to update (e.g., { username: "newUsername", email: "newEmail@example.com", password: "newPassword" })

    if (Object.keys(fields).length === 0) {
      return baseResponse(res, false, 400, "No fields provided for update", null);
    }

    const updatedUser = await userRepository.updateUserFields(id, fields);

    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    return baseResponse(res, true, 200, "User updated successfully", updatedUser);
  } catch (error) {
    console.error("Error updating user fields:", error);
    return baseResponse(res, false, 500, "Error updating user fields", error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await userRepository.deleteUser(id);
    if (!deletedUser) {
      return baseResponse(res, false, 404, 'User not found', null);
    }

    return baseResponse(res, true, 200, 'User deleted successfully', deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    return baseResponse(res, false, 500, 'Internal server error', null);
  }
};