const restaurantModel = require("../models/restaurant.model");
const baseResponse = require("../utils/baseResponse.util");

exports.createArticle = async (req, res) => {
  try {
    const { article, image } = req.body;
    const newArticle = await restaurantModel.createArticle(article, image);
    return baseResponse.success(res, 201, "Article created successfully", newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    return baseResponse.error(res, 500, "Internal server error");
  }
}

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await restaurantModel.getArticleById(id);
    if (!article) {
      return baseResponse.error(res, 404, "Article not found");
    }
    return baseResponse.success(res, 200, "Article retrieved successfully", article);
  } catch (error) {
    console.error("Error getting article by id:", error);
    return baseResponse.error(res, 500, "Internal server error");
  }
}

exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { article, image } = req.body;
    const updatedArticle = await restaurantModel.updateArticle(id, article, image);
    if (!updatedArticle) {
      return baseResponse.error(res, 404, "Article not found");
    }
    return baseResponse.success(res, 200, "Article updated successfully", updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return baseResponse.error(res, 500, "Internal server error");
  }
}

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArticle = await restaurantModel.deleteArticle(id);
    if (!deletedArticle) {
      return baseResponse.error(res, 404, "Article not found");
    }
    return baseResponse.success(res, 200, "Article deleted successfully", deletedArticle);
  } catch (error) {
    console.error("Error deleting article:", error);
    return baseResponse.error(res, 500, "Internal server error");
  }
}