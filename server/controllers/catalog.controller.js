const catalogModel = require("../models/catalog.model");
const baseResponse = require("../utils/baseResponse.util");

exports.getCatalogs = async (req, res) => {
  const { kategori_id, rentangHarga } = req.query;

  try {
    let query = {};

    if (kategori_id) {
      query.kategori_id = kategori_id;
    }

    if (rentangHarga) {
      const [min, max] = rentangHarga.split('-').map(Number);
      query.harga = { min, max };
    }

    const catalogs = await catalogModel.getCatalogs(query);
    return baseResponse(res, true, 200, "Catalogs fetched successfully", catalogs);
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    return baseResponse(res, false, 500, "Error fetching catalogs", error.message);
  }
};

exports.getCatalogDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const catalog = await catalogModel.getCatalogById(id);

    if (!catalog) {
      return baseResponse(res, false, 404, "Catalog not found", null);
    }

    return baseResponse(res, true, 200, "Catalog detail fetched successfully", catalog);
  } catch (error) {
    console.error("Error fetching catalog detail:", error);
    return baseResponse(res, false, 500, "Error fetching catalog detail", error.message);
  }
};

exports.createCatalog = async (req, res) => {
  const { namaKatalog, kategori_id, lokasi, places_id, harga, rating, deskripsiKatalog } = req.body;

  try {
    const catalog = await catalogModel.createCatalog({
      namaKatalog,
      kategori_id,
      lokasi,
      places_id,
      harga,
      rating,
      deskripsiKatalog
    });

    return baseResponse(res, true, 201, "Catalog created successfully", catalog);
  } catch (error) {
    console.error("Error creating catalog:", error);
    return baseResponse(res, false, 500, "Error creating catalog", error.message);
  }
};

exports.updateCatalog = async (req, res) => {
  const { id } = req.params;
  const catalogData = req.body;

  try {
    const updatedCatalog = await catalogModel.updateCatalog(id, catalogData);

    if (!updatedCatalog) {
      return baseResponse(res, false, 404, "Catalog not found", null);
    }

    return baseResponse(res, true, 200, "Catalog updated successfully", updatedCatalog);
  } catch (error) {
    console.error("Error updating catalog:", error);
    return baseResponse(res, false, 500, "Error updating catalog", error.message);
  }
};

exports.deleteCatalog = async (req, res) => {
  const { id } = req.params;

  try {
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