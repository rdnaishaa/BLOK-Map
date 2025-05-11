const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');
const upload = require('../config/pg.database').upload;
// const authMiddleware = require('../middleware/auth');
// const adminMiddleware = require('../middleware/admin');

const router = express.Router();

router.get('/:id', restaurantController.getArticleById);
router.post('/create', upload.single('image'), restaurantController.createArticle);
router.put('/update/:id', upload.single('image'), restaurantController.updateArticle);
router.delete('/delete/:id', restaurantController.deleteArticle);

module.exports = router;