const ReviewModel = require("../models/review.model");
const baseResponse = require("../utils/baseResponse.util");

const ReviewController = {
  async getReviews(req, res) {
    try {
      const { places_id } = req.params; 
      const reviews = await ReviewModel.getAllByPlace(places_id); 
      return res.status(200).json(baseResponse(res, true, 200, "Reviews fetched successfully", reviews));
    } catch (error) {
      return res.status(400).json(baseResponse(res, false, 400, error.message));
    }
  },

  async createReview(req, res) {
    try {
      const { content, rating, places_id } = req.body;
      const user_id = req.user.id; 

      if (rating < 1 || rating > 5) {
        return res.status(400).json(baseResponse(res, false, 400, "Rating must be between 1 and 5"));
      }

      const result = await ReviewModel.create({
        user_id,
        content,
        rating,
        places_id
      });

      return res.status(201).json(baseResponse(res, true, 201, "Review created successfully", result.rows[0]));
    } catch (error) {
      return res.status(500).json(baseResponse(res, false, 500, error.message));
    }
  },

  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { content, rating } = req.body; 

      if (rating < 1 || rating > 5) {
        return res.status(400).json(baseResponse(res, false, 400, "Rating must be between 1 and 5"));
      }

      const result = await ReviewModel.update(id, { content, rating });
      return res.status(200).json(baseResponse(res, true, 200, "Review updated successfully", result.rows[0]));
    } catch (error) {
      return res.status(400).json(baseResponse(res, false, 400, error.message));
    }
  },

  async deleteReview(req, res) {
    try {
      const { id } = req.params; 
      await ReviewModel.delete(id); 
      return res.status(200).json(baseResponse(res, true, 200, "Review deleted successfully", null));
    } catch (error) {
      return res.status(400).json(baseResponse(res, false, 400, error.message));
    }
  },
};

module.exports = ReviewController;