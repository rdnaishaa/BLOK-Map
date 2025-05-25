const express = require('express');
const userController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/me', protect, userController.getMe);
router.patch('/update/:id', protect, userController.updateUserFields); // user bisa update dirinya sendiri, admin bisa update siapapun (cek di controller)
router.delete('/delete/:id', protect, isAdmin, userController.deleteUser); // hanya admin (username 'sbd') yang bisa hapus user

module.exports = router;