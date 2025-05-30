const catalogModel = require("../models/catalog.model");
const baseResponse = require("../utils/baseResponse.util");
const { uploadImageToCloudinary } = require("../middleware/upload");

exports.getCatalogs = async (req, res) => {
  try {
    const catalogs = await catalogModel.getCatalogs();
    return baseResponse(res, true, 200, "Catalogs retrieved successfully", catalogs);
  } catch (error) {
    console.error("Error getting catalogs:", error);
    return baseResponse(res, false, 500, "Error retrieving catalogs", error.message);
  }
};

exports.getCatalogDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const catalog = await catalogModel.getCatalogById(id);

    if (!catalog) {
      return baseResponse(res, false, 404, "Catalog not found", null);
    }

    return baseResponse(res, true, 200, "Catalog retrieved successfully", catalog);
  } catch (error) {
    console.error("Error getting catalog:", error);
    return baseResponse(res, false, 500, "Error retrieving catalog", error.message);
  }
};

exports.getCatalogByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const catalogs = await catalogModel.getCatalogByRestaurantId(restaurantId);
    if (!catalogs || catalogs.length === 0) {
      return baseResponse(res, false, 404, "No catalogs found for this restaurant", null);
    }
    return baseResponse(res, true, 200, "Catalogs retrieved successfully", catalogs);
  } catch (error) {
    console.error("Error getting catalogs by restaurant ID:", error);
    return baseResponse(res, false, 500, "Error retrieving catalogs", error.message);
  }
};

exports.createCatalog = async (req, res) => {
  try {
    const {
      namaKatalog,
      kategoriRestaurant_id,
      lokasi,
      harga,
      deskripsiKatalog,
      restaurant_id
    } = req.body;
    const image = req.file;

    let imageUrl = null;
    if (image) {
        try {
            imageUrl = await uploadImageToCloudinary(image.buffer);
        } catch (uploadErr) {
            console.error("Error uploading image to Cloudinary:", uploadErr);
            return baseResponse(res, false, 500, "Image upload failed", uploadErr.message);
        }
    }

    const catalog = await catalogModel.createCatalog({
      namaKatalog,
      kategoriRestaurant_id,
      lokasi,
      harga,
      deskripsiKatalog,
      restaurant_id,
      image_url: imageUrl
    });

    return baseResponse(res, true, 201, "Catalog created successfully", catalog);
  } catch (error) {
    console.error("Error creating catalog:", error);
    return baseResponse(res, false, 500, "Error creating catalog", error.message);
  }
};

exports.updateCatalogFields = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body; // Fields to update (e.g., { lokasi: "New Location", harga: 50000 })

    if (Object.keys(fields).length === 0) {
      return baseResponse(res, false, 400, "No fields provided for update", null);
    }

    const updatedCatalog = await catalogModel.updateCatalogFields(id, fields);

    if (!updatedCatalog) {
      return baseResponse(res, false, 404, "Catalog not found", null);
    }

    return baseResponse(res, true, 200, "Catalog updated successfully", updatedCatalog);
  } catch (error) {
    console.error("Error updating catalog fields:", error);
    return baseResponse(res, false, 500, "Error updating catalog fields", error.message);
  }
};

exports.deleteCatalog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCatalog = await catalogModel.deleteCatalog(id);

    if (!deletedCatalog) {
      return baseResponse(res, false, 404, "Catalog not found", null);
    }

    return baseResponse(res, true, 200, "Catalog deleted successfully", deletedCatalog);
  } catch (error) {
    console.error("Error deleting catalog:", error);
    return baseResponse(res, false, 500, "Error deleting catalog", error.message);
  }
};