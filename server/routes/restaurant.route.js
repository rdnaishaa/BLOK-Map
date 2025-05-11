const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/', restaurantController.getRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.get('/categories/list', restaurantController.getKategoriList);
router.get('/locations/list', restaurantController.getLokasiList);

// Admin routes
router.use(authMiddleware);
router.use(adminMiddleware);
router.post('/', restaurantController.createRestaurant);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;