const express = require('express');
const placesController = require('../controllers/places.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', placesController.getPlaces);
router.get('/:id', placesController.getPlaceById);
router.post('/', protect, authorize('admin'), placesController.createPlace);
router.put('/:id', protect, authorize('admin'), placesController.updatePlace);
router.delete('/:id', protect, authorize('admin'), placesController.deletePlace);

module.exports = router;