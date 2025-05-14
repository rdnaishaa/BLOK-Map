const express = require('express');
const articlesController = require('../controllers/articles.controller'); 
const upload  = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', articlesController.getAllArticles);
router.post('/create', protect, authorize('admin'), upload.single('image'), articlesController.createArticle);
router.put('/update/:id/image', protect, authorize('admin'), upload.single('image'), articlesController.updateImage);
router.put('/update/:id', protect, authorize('admin'), upload.single('image'), articlesController.updateArticle);
router.delete('/delete/:id', protect, authorize('admin'), articlesController.deleteArticle);

module.exports = router;