const express = require('express');
const spotController = require('../controllers/spot.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router(protect);

router.post('/', authorize('user', 'admin'), spotController.createSpot);
router.get('/', spotController.getSpots);
router.get('/:id', spotController.getSpotById);
router.put('/:id', authorize('admin'), spotController.updateSpot);
router.delete('/:id', authorize('admin'), spotController.deleteSpot);

module.exports = router;