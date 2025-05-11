const express = require('express');
const catalogController = require('../controllers/catalog.controller');
const upload = require('../config/pg.database').upload;

const router = express.Router();

router.get('/', catalogController.getCatalogs);

router.get('/:id', catalogController.getCatalogDetail);

router.put('/:id', catalogController.updateCatalog);

router.delete('/:id', catalogController.deleteCatalog);

module.exports = router;
