const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');
const { protect } = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const router = express.Router();

router.get('/', restaurantController.getRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', protect, isAdmin, restaurantController.createRestaurant);
router.patch('/:id', protect, isAdmin, restaurantController.updateRestaurantFields);
router.delete('/:id', protect, isAdmin, restaurantController.deleteRestaurant);

module.exports = router;