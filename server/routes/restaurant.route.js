const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');
const upload = require('../database/pgDatabase').upload;
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.get('/categories/list', restaurantController.getKategoriList);
router.get('/location/list', restaurantController.getLokasiList);

// Admin routes
router.use(authMiddleware);
router.use(adminMiddleware);
router.post('/', upload.single('image'), restaurantController.createRestaurant);
router.put('/:id', upload.single('image'), restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;