const express = require('express');
const articlesController = require('../controllers/articles.controller'); 
const { upload }  = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', articlesController.getAllArticles);
router.get('/restaurants', articlesController.getAllRestaurantsArticles);
router.get('/spots', articlesController.getAllSpotsArticles);
router.get('/restaurant/:id', articlesController.getRestaurantArticleById);
router.get('/spot/:id', articlesController.getSpotArticleById);
router.post('/create', protect, authorize('admin'), upload.single('image'), articlesController.createArticle);
router.put('/update/:id/image', protect, authorize('admin'), upload.single('image'), articlesController.updateImage);
router.patch('/update/:id', protect, authorize('admin'), articlesController.updateArticleFields);
router.delete('/delete/:id', protect, authorize('admin'), articlesController.deleteArticle);

module.exports = router;