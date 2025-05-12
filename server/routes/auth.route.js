const express = require('express');
const userController = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/update/:id', protect, authorize('admin'), userController.updateUser);
router.delete('/delete/:id', protect, authorize('admin'), userController.deleteUser);

module.exports = router;