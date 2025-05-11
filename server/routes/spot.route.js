const express = require('express');
const spotController = require('../controllers/spot.controller');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/', spotController.getSpots);
router.get('/:id', spotController.getSpotById);
router.get('/categories/list', spotController.getKategoriList);
router.get('/locations/list', spotController.getLokasiList);

// Admin routes
router.use(authMiddleware);
router.use(adminMiddleware);
router.post('/', spotController.createSpot);
router.put('/:id', spotController.updateSpot);
router.delete('/:id', spotController.deleteSpot);

module.exports = router;