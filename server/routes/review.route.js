const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const { verifyUser, verifyAdmin } = require('../middleware/auth');

// User routes
router.get('/:category/:id', ReviewController.getReviews);  
router.post('/', verifyUser, ReviewController.createReview);  // Pastikan ini mengarah ke fungsi yang benar
router.put('/:id', verifyUser, ReviewController.updateReview);  
router.delete('/:id', verifyUser, ReviewController.deleteReview);

// Admin routes - Moderation
router.delete('/admin/:id', verifyAdmin, ReviewController.deleteReview);
router.put('/admin/:id/status', verifyAdmin, ReviewController.moderateReview); // approve/reject
router.put('/admin/:id', verifyAdmin, ReviewController.adminEditReview); // edit review

module.exports = router;
