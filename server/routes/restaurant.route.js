const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');
const upload = require('../config/pg.database').upload;
const { protect, authorize } = require('../middleware/auth');

const router = express.Router(protect);

router.get('/:id', restaurantController.getArticleById);
router.post('/create', upload.single('image'), restaurantController.createArticle);
router.put('/update/:id', authorize('admin'), upload.single('image'), restaurantController.updateArticle);
router.delete('/delete/:id', authorize('admin'), restaurantController.deleteArticle);

module.exports = router;