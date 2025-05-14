const express = require('express');
const ReviewController = require('../controllers/review.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router(protect);

router.get('/', ReviewController.getReviews);
router.post('/', protect, authorize('user', 'admin'), ReviewController.createReview);
router.patch('/:id', protect, authorize('user', 'admin'), ReviewController.updateReviewFields);
router.delete('/:id', protect, authorize('user', 'admin'), ReviewController.deleteReview);

module.exports = router;