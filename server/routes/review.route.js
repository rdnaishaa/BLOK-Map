const express = require('express');
const ReviewController = require('../controllers/review.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router(protect);

router.get('/:category/:id', ReviewController.getReviews);
router.post('/', authorize('user', 'admin'), ReviewController.createReview);
router.put('/:id', authorize('user', 'admin'), ReviewController.updateReview);
router.delete('/:id', authorize('user', 'admin'), ReviewController.deleteReview);

module.exports = router;