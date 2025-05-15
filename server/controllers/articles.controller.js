const articlesModel = require("../models/articles.model");
const baseResponse = require("../utils/baseResponse.util");
const { cloudinary } = require("../config/pg.database");

exports.createArticle = async (req, res) => {
  try {
    const { judulArtikel, kontenArtikel, restaurant_id, spot_id } = req.body;
    const image = req.file;
    
    if (!restaurant_id && !spot_id) {
      return baseResponse(res, false, 400, "Either restaurant_id or spot_id must be provided", null);
    }

    let imageUrl = null;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image.path);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadErr) {
        console.error("Error uploading image to Cloudinary:", uploadErr);
        return baseResponse(res, false, 500, "Image upload failed", uploadErr.message);
      }
    }

    const articleData = { 
      judulArtikel,   
      kontenArtikel, 
      restaurant_id, 
      spot_id,
      image_url : imageUrl,
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
    const { judulArtikel, kontenArtikel, restaurant_id, spot_id, image_url } = req.body;
    const image = req.file;

    let imageUrl = null;
    if (image_url !== null) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image.path);
        imageUrl = uploadResponse.secure_url;
        console.log("Image URL:", imageUrl);
      } catch (uploadErr) {
        console.error("Error uploading image to Cloudinary:", uploadErr);
        return baseResponse(res, false, 500, "Image upload failed", uploadErr.message);
      }
    }else{
      imageUrl = image_url;
    }
    
    const articleData = { 
      judulArtikel, 
      kontenArtikel, 
      restaurant_id, 
      spot_id,
      image_url : imageUrl,
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

exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.file;
    console.log("File received in controller:", req.file); // Log file yang diterima
    console.log("Params received:", req.params);

    if (!image) {
      return baseResponse(res, false, 400, "Image is required", null);
    }

    let imageUrl = null;
    try {
      const uploadResponse = await cloudinary.uploader.upload(image.path);
      imageUrl = uploadResponse.secure_url;
    } catch (uploadErr) {
      console.error("Error uploading image to Cloudinary:", uploadErr);
      return baseResponse(res, false, 500, "Image upload failed", uploadErr.message);
    }

    const updatedImage = await articlesModel.updateImage(id, imageUrl);
    if (!updatedImage) {
      return baseResponse(res, false, 404, "Article not found", null);
    }
    return baseResponse(res, true, 200, "Image updated successfully", updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
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