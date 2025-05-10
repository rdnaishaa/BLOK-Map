// server/controllers/review.controller.js
const ReviewModel = require('../models/review.model');

const ReviewController = {
  async createReview(req, res) {
    try {
      const { user_id, place_id, rating, comment } = req.body;
      const newReview = await ReviewModel.create({ user_id, place_id, rating, comment });
      res.status(201).json({ success: true, data: newReview });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Gagal membuat review.' });
    }
  },

  async getAllReviews(req, res) {
    try {
      const reviews = await ReviewModel.findAll();
      res.json({ success: true, data: reviews });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Gagal mengambil data review.' });
    }
  },

  async getReviewById(req, res) {
    try {
      const { id } = req.params;
      const review = await ReviewModel.findById(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review tidak ditemukan.' });
      }
      res.json({ success: true, data: review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Gagal mengambil review.' });
    }
  },

  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const updated = await ReviewModel.update(id, { rating, comment });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Review tidak ditemukan.' });
      }
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Gagal memperbarui review.' });
    }
  },

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ReviewModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Review tidak ditemukan.' });
      }
      res.json({ success: true, message: 'Review berhasil dihapus.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Gagal menghapus review.' });
    }
  },
};

module.exports = ReviewController;
