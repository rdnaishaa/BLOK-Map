require('dotenv').config();
const baseResponse = require('../utils/baseResponse.util');
const userRepository = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name } = req.body;

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

    return baseResponse(res, true, 201, 'User registered successfully', userData);
  } catch (error) {
    console.error('Error registering user:', error);
    return baseResponse(res, false, 500, 'Internal server error', null);
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.loginUser(email, password);
    if (!user) {
      return baseResponse(res, false, 401, 'Invalid email or password', null);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
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

    return baseResponse(res, true, 200, 'User logged in successfully', userData);
  } catch (error) {
    console.error('Error logging in user:', error);
    return baseResponse(res, false, 500, 'Internal server error', null);
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, first_name, last_name } = req.body;

    const updatedUser = await userRepository.updateUser(id, {
      username,
      email,
      password,
      role,
      first_name,
      last_name
    });

    if (!updatedUser) {
      return baseResponse(res, false, 404, 'User not found', null);
    }

    return baseResponse(res, true, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return baseResponse(res, false, 500, 'Internal server error', null);
  }
}

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
}
