const articlesModel = require("../models/articles.model");
const baseResponse = require("../utils/baseResponse.util");
const { uploadImageToCloudinary } = require("../middleware/upload");

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
        imageUrl = await uploadImageToCloudinary(image.buffer);
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
      image_url: imageUrl,
    };

    const newArticle = await articlesModel.createArticle(articleData);
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

exports.getAllRestaurantsArticles = async (req, res) => {
  try {
    const articles = await articlesModel.getAllRestaurantsArticles();
    return baseResponse(res, true, 200, "Restaurant articles retrieved successfully", articles);
  } catch (error) {
    console.error("Error getting all restaurant articles:", error);
    return baseResponse(res, false, 500, "Internal server error", error.message);
  }
}

exports.getAllSpotsArticles = async (req, res) => {
  try {
    const articles = await articlesModel.getAllSpotsArticles();
    return baseResponse(res, true, 200, "Spot articles retrieved successfully", articles);
  } catch (error) {
    console.error("Error getting all spot articles:", error);
    return baseResponse(res, false, 500, "Internal server error", error.message);
  }
}

exports.getRestaurantArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await articlesModel.getRestaurantArticleById(id);
    if (!article) {
      return baseResponse(res, false, 404, "Article not found", null);
    }
    return baseResponse(res, true, 200, "Article retrieved successfully", article);
  } catch (error) {
    console.error("Error getting article by ID:", error);
    return baseResponse(res, false, 500, "Internal server error", error.message);
  }
};

exports.getSpotArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await articlesModel.getSpotArticleById(id);
    if (!article) {
      return baseResponse(res, false, 404, "Article not found", null);
    }
    return baseResponse(res, true, 200, "Article retrieved successfully", article);
  } catch (error) {
    console.error("Error getting article by ID:", error);
    return baseResponse(res, false, 500, "Internal server error", error.message);
  }
}

exports.updateArticleFields = async (req, res) => {
  try {
    const { id } = req.params;
    let fields = req.body;
    // Mapping field dari frontend ke field database
    if (fields.title) {
      fields.judulArtikel = fields.title;
      delete fields.title;
    }
    if (fields.content) {
      fields.kontenArtikel = fields.content;
      delete fields.content;
    }
    if (fields.category) {
      fields.kategori = fields.category;
      delete fields.category;
    }
    if (fields.location) {
      fields.lokasi = fields.location;
      delete fields.location;
    }
    if (Object.keys(fields).length === 0) {
      return baseResponse(res, false, 400, "No fields provided for update", null);
    }
    const updatedArticle = await articlesModel.updateArticleFields(id, fields);
    if (!updatedArticle) {
      return baseResponse(res, false, 404, "Article not found", null);
    }
    return baseResponse(res, true, 200, "Article updated successfully", updatedArticle);
  } catch (error) {
    console.error("Error updating article fields:", error);
    return baseResponse(res, false, 500, "Error updating article fields", error.message);
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.file;
    console.log("File received in controller:", req.file); 
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