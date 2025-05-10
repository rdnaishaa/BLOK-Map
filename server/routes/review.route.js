// server/routes/review.route.js
const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');

// Semua review
router.get('/', ReviewController.getAllReviews);

// Satu review berdasarkan ID
router.get('/:id', ReviewController.getReviewById);

// Buat review baru
router.post('/', ReviewController.createReview);

// Update review
router.put('/:id', ReviewController.updateReview);

// Hapus review
router.delete('/:id', ReviewController.deleteReview);

module.exports = router;
