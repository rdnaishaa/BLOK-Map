const express = require('express');
const articlesController = require('../controllers/articles.controller'); 
const upload = require('../config/pg.database').upload;
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', articlesController.getAllArticles);
router.post('/create', upload.single('image'), articlesController.createArticle);
router.put('/update/:id', protect,authorize('admin'),upload.single('image'),articlesController.updateArticle);
router.delete('/delete/:id', protect,authorize('admin'),articlesController.deleteArticle);

module.exports = router;