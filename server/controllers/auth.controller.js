require('dotenv').config();
const baseResponse = require('../utils/baseResponse.util');
const userRepository = require('../models/user.model');
const jwt = require('jsonwebtoken');

const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return regex.test(password);
}

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name } = req.body;

    if (!username || !email || !password) {
      return baseResponse(res, false, 400, 'Please provide username, email, and password', null);
    }

    if (!validatePassword(password)) {
      return baseResponse(res, false, 400, 'Password must be at least 6 characters long, include a number, and a special character', null);
    }

    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 400, 'Email already exists', null);
    }

    const newUser = await userRepository.registerUser({
      username,
      email,
      password,
      role: role || 'user',
      first_name,
      last_name
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });

    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      token
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return baseResponse(res, true, 201, 'User registered successfully', userData);
  } catch (error) {
    console.error('Error registering user:', error);
    return baseResponse(res, false, 500, 'Internal server error', null);
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return baseResponse(res, false, 400, 'Please provide email and password', null);
    }

    const user = await userRepository.loginUser(email, password);
    if (!user) {
      return baseResponse(res, false, 401, 'Invalid email or password', null);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      token
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });


    return baseResponse(res, true, 200, 'User logged in successfully', userData);
  } catch (error) {
    console.error('Error logging in user:', error);
    return baseResponse(res, false, 500, 'Internal server error', null);
  }
};

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