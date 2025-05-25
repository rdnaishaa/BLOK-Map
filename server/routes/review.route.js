const express = require('express');
const ReviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

const router = express.Router();

router.get('/', ReviewController.getReviews);
router.get('/restaurant/:restaurant_id', ReviewController.getReviewsByRestaurantId);
router.get('/spot/:spot_id', ReviewController.getReviewsBySpotId);
router.post('/', protect, ReviewController.createReview); // semua user bisa create
router.patch('/:id', protect, isAdmin, ReviewController.updateReviewFields); // hanya admin bisa update review siapapun
router.delete('/:id', protect, ReviewController.deleteReview); // user bisa hapus review miliknya sendiri, admin bisa hapus semua (cek di controller)

module.exports = router;