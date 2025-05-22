const express = require('express');
const catalogController = require('../controllers/catalog.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', catalogController.getCatalogs);
router.get('/:id', catalogController.getCatalogDetail);
router.get('/restaurant/:restaurantId', catalogController.getCatalogByRestaurantId);
router.post('/', protect, authorize('admin'), catalogController.createCatalog);
router.patch('/:id', protect, authorize('admin'), catalogController.updateCatalogFields);
router.delete('/:id', protect, authorize('admin'), catalogController.deleteCatalog);

module.exports = router;