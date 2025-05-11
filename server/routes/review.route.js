const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.get('/:category/:id', ReviewController.getReviews);  
router.post('/', protect, ReviewController.createReview);  
router.put('/:id', protect, ReviewController.updateReview);  
router.delete('/:id', protect, ReviewController.deleteReview);  

// Admin routes - Moderation
router.delete('/admin/:id', protect, authorize('admin'), ReviewController.deleteReview);
router.put('/admin/:id/status', protect, authorize('admin'), ReviewController.moderateReview);
router.put('/admin/:id', protect, authorize('admin'), ReviewController.adminEditReview);

module.exports = router;
