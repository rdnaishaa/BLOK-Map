const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', restaurantController.getRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', protect, authorize('admin'), restaurantController.createRestaurant);
router.patch('/:id', protect, authorize('admin'), restaurantController.updateRestaurantFields);
router.delete('/:id', protect, authorize('admin'), restaurantController.deleteRestaurant);

module.exports = router;