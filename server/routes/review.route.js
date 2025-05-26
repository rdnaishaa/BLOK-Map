// server/routes/review.route.js
const express = require('express');
const ReviewController = require('../controllers/review.controller');
const { protect, isAdmin, isUser } = require('../middleware/auth');

const router = express.Router();

router.get('/', ReviewController.getReviews);
router.get('/restaurant/:restaurant_id', ReviewController.getReviewsByRestaurantId);
router.get('/spot/:spot_id', ReviewController.getReviewsBySpotId);
router.post('/', protect, isUser, ReviewController.createReview); // Only user (not admin)
router.patch('/:id', protect, ReviewController.updateReviewFields); // Only owner or admin (cek di controller)
router.delete('/:id', protect, ReviewController.deleteReview); // Only owner or admin (cek di controller)

module.exports = router;