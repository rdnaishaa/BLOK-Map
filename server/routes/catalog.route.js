const express = require('express');
const catalogController = require('../controllers/catalog.controller');
const { protect } = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const router = express.Router();

router.get('/', catalogController.getCatalogs);
router.get('/:id', catalogController.getCatalogDetail);
router.get('/restaurant/:restaurantId', catalogController.getCatalogByRestaurantId);
router.post('/', protect, isAdmin, catalogController.createCatalog);
router.patch('/:id', protect, isAdmin, catalogController.updateCatalogFields);
router.delete('/:id', protect, isAdmin, catalogController.deleteCatalog);

module.exports = router;