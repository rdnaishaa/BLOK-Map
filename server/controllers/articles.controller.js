const articlesModel = require("../models/articles.model");
const baseResponse = require("../utils/baseResponse.util");

exports.createArticle = async (req, res) => {
  try {
    const { judulArtikel, kontenArtikel, restaurant_id, spot_id } = req.body;
    const image = req.file;
    
    if (!restaurant_id && !spot_id) {
      return baseResponse(res, false, 400, "Either restaurant_id or spot_id must be provided", null);
    }

    const articleData = { 
      judulArtikel, 
      kontenArtikel, 
      restaurant_id, 
      spot_id 
    };

    const newArticle = await articlesModel.createArticle(articleData, image);
    return baseResponse(res, true, 201, "Article created successfully", newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    return baseResponse(res, false, 500, "Internal server error", error.message);
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await articlesModel.getAllArticles();
    return baseResponse(res, true, 200, "Articles retrieved successfully", articles);
  } catch (error) {
    console.error("Error getting all articles:", error);
    return baseResponse(res, false, 500, "Internal server error", error.message);
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { judulArtikel, kontenArtikel, restaurant_id, spot_id } = req.body;
    const image = req.file;
    
    const articleData = { 
      judulArtikel, 
      kontenArtikel, 
      restaurant_id, 
      spot_id 
    };

    const updatedArticle = await articlesModel.updateArticle(id, articleData, image);
    if (!updatedArticle) {
      return baseResponse(res, false, 404, "Article not found", null);
    }
    return baseResponse(res, true, 200, "Article updated successfully", updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return baseResponse(res, false, 500, "Internal server error", error.message);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArticle = await articlesModel.deleteArticle(id);
    if (!deletedArticle) {
      return baseResponse(res, false, 404, "Article not found", null);
    }
    return baseResponse(res, true, 200, "Article deleted successfully", deletedArticle);
  } catch (error) {
    console.error("Error deleting article:", error);
    return baseResponse(res, false, 500, "Internal server error", error.message);
  }
};