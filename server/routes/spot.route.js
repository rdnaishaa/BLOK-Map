const express = require('express');
const spotController = require('../controllers/spot.controller');
const { protect } = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const router = express.Router();

router.get('/', spotController.getSpots);
router.get('/:id', spotController.getSpotById);
router.get('/categories/list', spotController.getKategoriList);
router.get('/locations/list', spotController.getLokasiList);
router.post('/', protect, isAdmin, spotController.createSpot);
router.patch('/:id', protect, isAdmin, spotController.updateSpotFields);
router.delete('/:id', protect, isAdmin, spotController.deleteSpot);

module.exports = router;