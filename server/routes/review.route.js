const express = require('express');
const ReviewController = require('../controllers/review.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router(protect);

router.get('/', ReviewController.getReviews);
router.post('/', protect, authorize('user', 'admin'), ReviewController.createReview);
router.put('/:id', protect, authorize('user', 'admin'), ReviewController.updateReview);
router.delete('/:id', protect, authorize('user', 'admin'), ReviewController.deleteReview);

module.exports = router;