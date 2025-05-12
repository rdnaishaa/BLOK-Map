const ReviewModel = require("../models/review.model");
const baseResponse = require("../utils/baseResponse.util");

const ReviewController = {
  async getReviews(req, res) {
    try {
      const { category, id } = req.params;
      const result = await ReviewModel.getAllByCategory(category, id);
      return res.status(200).json(baseResponse.success(result.rows));
    } catch (error) {
      return res.status(400).json(baseResponse.error(error.message));
    }
  },

  async createReview(req, res) {
    try {
      const { content, rating, spot_id = null, cafe_id = null, resto_id = null } = req.body;
      const user_id = req.user.id;

      if (rating < 1 || rating > 5) {
        return res.status(400).json(baseResponse.error("Rating must be between 1 and 5"));
      }

      const result = await ReviewModel.create({
        user_id,
        content,
        rating,
        spot_id,
        cafe_id,
        resto_id
      });

      return res.status(201).json(baseResponse.success(result.rows[0]));
    } catch (error) {
      return res.status(500).json(baseResponse.error(error.message));
    }
  },

  // Update an existing review
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { content, rating } = req.body;

      // Validate rating
      if (rating < 1 || rating > 5) {
        return res.status(400).json(baseResponse.error("Rating must be between 1 and 5"));
      }

      const result = await ReviewModel.update(id, { content, rating });
      return res.status(200).json(baseResponse.success(result.rows[0]));
    } catch (error) {
      return res.status(400).json(baseResponse.error(error.message));
    }
  },

  // Delete a review
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      await ReviewModel.delete(id);
      return res.status(200).json(baseResponse.success(null, 'Review deleted successfully'));
    } catch (error) {
      return res.status(400).json(baseResponse.error(error.message));
    }
  },

  // Admin set status (approve / reject)
  async moderateReview(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json(baseResponse.error('Invalid status value'));
      }

      const result = await ReviewModel.updateStatus(id, status);
      return res.status(200).json(baseResponse.success(result.rows[0]));
    } catch (error) {
      return res.status(400).json(baseResponse.error(error.message));
    }
  },

  // Admin edit review (optional)
  async adminEditReview(req, res) {
    try {
      const { id } = req.params;
      const { content, rating } = req.body;

      const result = await ReviewModel.adminEdit(id, { content, rating });
      return res.status(200).json(baseResponse.success(result.rows[0]));
    } catch (error) {
      return res.status(400).json(baseResponse.error(error.message));
    }
  },
};

module.exports = ReviewController;
