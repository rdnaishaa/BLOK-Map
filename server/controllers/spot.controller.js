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
    const spots = await spotModel.getSpots(req.query);

    return res.json({
      success: true,
      message: "Spots retrieved successfully",
      payload: spots
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving spots",
      error: error.message
    });
  }
};

exports.getSpotById = async (req, res) => {
    try {
        const { id } = req.params;
        const spot = await spotModel.getSpotById(id);
        
        if (!spot) {
            return res.status(404).json({
                success: false,
                message: "Spot not found"
            });
        }

        return res.json({
            success: true,
            message: "Spot retrieved successfully",
            payload: spot
        });
    } catch (error) {
        console.error("Error getting spot:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving spot",
            error: error.message
        });
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
        return res.json({
            success: true,
            message: "Categories retrieved successfully",
            payload: categories
        });
    } catch (error) {
        console.error("Error getting categories:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving categories",
            error: error.message
        });
    }
};

exports.getLokasiList = async (req, res) => {
    try {
        const locations = await spotModel.getLokasiList();
        return res.json({
            success: true,
            message: "Locations retrieved successfully",
            payload: locations
        });
    } catch (error) {
        console.error("Error getting locations:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving locations",
            error: error.message
        });
    }
};