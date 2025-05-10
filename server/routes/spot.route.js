const express = require('express');
const spotController = require('../controllers/spot.controller');
const upload = require('../database/pgDatabase').upload;
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/', spotController.getAllSpots);
router.get('/:id', spotController.getSpotById);
router.get('/kategories/list', spotController.getKategoriList);
router.get('/lokasis/list', spotController.getLokasiList);

// Admin routes
router.use(authMiddleware);
router.use(adminMiddleware);
router.post('/', upload.single('image'), spotController.createSpot);
router.put('/:id', upload.single('image'), spotController.updateSpot);
router.delete('/:id', spotController.deleteSpot);

module.exports = router;