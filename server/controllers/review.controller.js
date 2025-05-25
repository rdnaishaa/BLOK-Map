const ReviewModel = require("../models/review.model");
const baseResponse = require("../utils/baseResponse.util");

const ReviewController = {
  async getReviews(req, res) {
    try {
      const reviews = await ReviewModel.getAll();
      return res.status(200).json(
        baseResponse(res, true, 200, "Reviews retrieved successfully", reviews)
      );
    } catch (error) {
      console.error("Error getting reviews:", error);
      return res.status(500).json(
        baseResponse(res, false, 500, "Error retrieving reviews", error.message)
      );
    }
  },

  async getReviewsByRestaurantId(req, res) {
    try {
      const { restaurant_id } = req.params;
      const reviews = await ReviewModel.getByRestaurantId(restaurant_id);
      if (!reviews) {
        return res.status(404).json(
          baseResponse(res, false, 404, "No reviews found for this restaurant")
        );
      }
      return res.status(200).json(
        baseResponse(res, true, 200, "Reviews retrieved successfully", reviews)
      );
    } catch (error) {
      console.error("Error getting reviews by restaurant id:", error);
      return res.status(500).json(
        baseResponse(res, false, 500, "Error retrieving reviews", error.message)
      )
    }
  },

  async getReviewsBySpotId(req, res) {
    try {
      const { spot_id } = req.params;
      const reviews = await ReviewModel.getBySpotId(spot_id);
      if (!reviews) {
        return res.status(404).json(
          baseResponse(res, false, 404, "No reviews found for this spot")
        );
      }
      return res.status(200).json(
        baseResponse(res, true, 200, "Reviews retrieved successfully", reviews)
      );
    } catch (error) {
      console.error("Error getting reviews by spot id:", error);
      return res.status(500).json(
        baseResponse(res, false, 500, "Error retrieving reviews", error.message)
      );
    }
  },
  
  async createReview(req, res) {
    try {
      const { content, rating, spot_id, resto_id, user_id } = req.body;

      if (!spot_id && !resto_id) {
        return res.status(400).json(
          baseResponse(res, false, 400, "Either spot_id or resto_id must be provided")
        );
      }

      if (rating < 0 || rating > 5) {
        return res.status(400).json(
          baseResponse(res, false, 400, "Rating must be between 0 and 5")
        );
      }

      const result = await ReviewModel.create({
        user_id,
        content,
        rating,
        spot_id,
        resto_id
      });

      return res.status(201).json(
        baseResponse(res, true, 201, "Review created successfully", result)
      );
    } catch (error) {
      return res.status(500).json(
        baseResponse(res, false, 500, error.message)
      );
    }
  },

  async updateReviewFields(req, res) {
    try {
      const { id } = req.params;
      const fields = req.body; // Fields to update (e.g., { content: "Updated content", rating: 4.5 })

      if (Object.keys(fields).length === 0) {
        return res.status(400).json(
          baseResponse(res, false, 400, "No fields provided for update", null)
        );
      }

      const review = await ReviewModel.getById(id);
      if (!review) {
        return res.status(404).json(
          baseResponse(res, false, 404, "Review not found")
        );
      }

      if (review.user_id !== req.user.id && req.user.role !== 'admin') {
         return res.status(403).json(
            baseResponse(res, false, 403, "Not authorized to update this review")
         );
      }

      if (fields.rating !== undefined && (fields.rating < 0 || fields.rating > 5)) {
        return res.status(400).json(
          baseResponse(res, false, 400, "Rating must be between 0 and 5")
        );
      }

      const updatedReview = await ReviewModel.updateReviewFields(id, fields);

      if (!updatedReview) {
        return res.status(404).json(
          baseResponse(res, false, 404, "Review not found", null)
        );
      }

      return res.status(200).json(
        baseResponse(res, true, 200, "Review updated successfully", updatedReview)
      );
    } catch (error) {
      console.error("Error updating review fields (detail):", error);
      return res.status(500).json(
        baseResponse(res, false, 500, "Error updating review fields", error.message)
      );
    }
  },

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      
      const review = await ReviewModel.getById(id);
      if (!review) {
        return res.status(404).json(
          baseResponse(res, false, 404, "Review not found")
        );
      }

      if (review.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json(
          baseResponse(res, false, 403, "Not authorized to delete this review")
        );
    }

      const result = await ReviewModel.delete(id);
      return res.status(200).json(
        baseResponse(res, true, 200, "Review deleted successfully", result)
      );
    } catch (error) {
      return res.status(400).json(
        baseResponse(res, false, 400, error.message)
      );
    }
  }
};

module.exports = ReviewController;