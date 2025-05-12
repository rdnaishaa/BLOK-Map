const placeModel = require("../models/places.model");
const BaseResponse = require("../utils/baseResponse.util");

exports.createPlace = async (req, res) => {
    const { namaTempat, kategori_id, lokasi, rating, price } = req.body;
    try {
        const place = await placeModel.createPlace({
            namaTempat,
            kategori_id,
            lokasi,
            rating,
            price
        });
        return BaseResponse(res, true, 201, "Place created", place);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error creating place", error);
    }
};

exports.getPlaces = async (req, res) => {
    try {
        const { search, kategori_id, lokasi } = req.query;
        const places = await placeModel.getPlaces({ search, kategori_id, lokasi });
        return BaseResponse(res, true, 200, "Places found", places);
    } catch (error) {
        console.error("Error retrieving places:", error);
        return BaseResponse(res, false, 500, "Error retrieving places", error);
    }
};

exports.getPlaceById = async (req, res) => {
    try {
        const place = await placeModel.getPlaceById(req.params.id);
        if (!place) {
            return BaseResponse(res, false, 404, "Place not found", null);
        }
        return BaseResponse(res, true, 200, "Place found", place);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error retrieving place", error);
    }
};

exports.updatePlace = async (req, res) => {
    const { id } = req.params;
    const { namaTempat, kategori_id, lokasi, rating, price } = req.body;
    try {
        const place = await placeModel.updatePlace(id, {
            namaTempat,
            kategori_id,
            lokasi,
            rating,
            price
        });
        if (!place) {
            return BaseResponse(res, false, 404, "Place not found", null);
        }
        return BaseResponse(res, true, 200, "Place updated", place);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error updating place", error);
    }
};

exports.deletePlace = async (req, res) => {
    try {
        const place = await placeModel.deletePlace(req.params.id);
        if (!place) {
            return BaseResponse(res, false, 404, "Place not found", null);
        }
        return BaseResponse(res, true, 200, "Place deleted", place);
    } catch (error) {
        return BaseResponse(res, false, 500, "Error deleting place", error);
    }
};