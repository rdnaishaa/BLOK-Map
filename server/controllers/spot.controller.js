const spotModel = require("../models/spot.model");
const BaseResponse = require("../utils/baseResponse.util");

exports.createSpot = async (req, res) => {
    const { namaTempat, kategori, lokasi, rating, price } = req.body;
    try {
        const spot = await spotModel.createSpot({
            namaTempat,
            kategori,
            lokasi,
            rating,
            price
        });
        return BaseResponse(res, true, 201, "Spot created successfully", spot);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error creating spot", error.message);
    }
};

exports.getSpots = async (req, res) => {
    try {
        const { search, kategori, lokasi } = req.query;
        const spots = await spotModel.getSpots({ search, kategori, lokasi });
        return BaseResponse(res, true, 200, "Spots retrieved successfully", spots);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error retrieving spots", error.message);
    }
};

exports.getSpotById = async (req, res) => {
    try {
        const spot = await spotModel.getSpotById(req.params.id);
        if (!spot) {
            return BaseResponse(res, false, 404, "Spot not found", null);
        }
        return BaseResponse(res, true, 200, "Spot retrieved successfully", spot);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error retrieving spot", error.message);
    }
};

exports.updateSpotFields = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body; 

    if (Object.keys(fields).length === 0) {
      return BaseResponse(res, false, 400, "No fields provided for update", null);
    }

    const updatedSpot = await spotModel.updateSpotFields(id, fields);

    if (!updatedSpot) {
      return BaseResponse(res, false, 404, "Spot not found", null);
    }

    return BaseResponse(res, true, 200, "Spot updated successfully", updatedSpot);
  } catch (error) {
    console.error("Error updating spot fields:", error);
    return BaseResponse(res, false, 500, "Error updating spot fields", error.message);
  }
};

exports.deleteSpot = async (req, res) => {
    try {
        const spot = await spotModel.deleteSpot(req.params.id);
        if (!spot) {
            return BaseResponse(res, false, 404, "Spot not found", null);
        }
        return BaseResponse(res, true, 200, "Spot deleted successfully", spot);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error deleting spot", error.message);
    }
};

exports.getKategoriList = async (req, res) => {
    try {
        const categories = await spotModel.getKategoriList();
        return BaseResponse(res, true, 200, "Categories retrieved successfully", categories);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error retrieving categories", error.message);
    }
};

exports.getLokasiList = async (req, res) => {
    try {
        const locations = await spotModel.getLokasiList();
        return BaseResponse(res, true, 200, "Locations retrieved successfully", locations);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error retrieving locations", error.message);
    }
};