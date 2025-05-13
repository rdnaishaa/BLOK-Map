const express = require('express');
const spotController = require('../controllers/spot.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', spotController.getSpots);
router.get('/:id', spotController.getSpotById);
router.get('/categories/list', spotController.getKategoriList);
router.get('/locations/list', spotController.getLokasiList);
router.post('/', protect, authorize('admin'), spotController.createSpot);
router.put('/:id', protect, authorize('admin'), spotController.updateSpot);
router.delete('/:id', protect, authorize('admin'), spotController.deleteSpot);

module.exports = router;