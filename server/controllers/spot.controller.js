const spotModel = require("../models/spot.model");
const baseResponse = require("../utils/baseResponse");

exports.createSpot = async (req, res) => {
    const { namaHangout, kategori, lokasi, informasiHangout } = req.body;
    try {
        const spot = await spotModel.createSpot({
            namaHangout,
            kategori,
            lokasi,
            informasiHangout
        });
        return baseResponse(res, true, 201, "Spot created", spot);
    } catch (error) {
        return baseResponse(res, false, 500, "Error creating spot", error);
    }
};

exports.getSpots = async (req, res) => {
    try {
        const { search, kategori, lokasi } = req.query;
        const spots = await spotModel.getSpots({ search, kategori, lokasi });
        return baseResponse(res, true, 200, "Spots found", spots);
    } catch (error) {
        return baseResponse(res, false, 500, "Error retrieving spots", error);
    }
};

exports.getSpotById = async (req, res) => {
    try {
        const spot = await spotModel.getSpotById(req.params.id);
        if (!spot) {
            return baseResponse(res, false, 404, "Spot not found", null);
        }
        return baseResponse(res, true, 200, "Spot found", spot);
    } catch (error) {
        return baseResponse(res, false, 500, "Error retrieving spot", error);
    }
};

exports.updateSpot = async (req, res) => {
    const { id } = req.params;
    const { namaHangout, kategori, lokasi, informasiHangout } = req.body;
    try {
        const spot = await spotModel.updateSpot(id, {
            namaHangout,
            kategori,
            lokasi,
            informasiHangout
        });
        if (!spot) {
            return baseResponse(res, false, 404, "Spot not found", null);
        }
        return baseResponse(res, true, 200, "Spot updated", spot);
    } catch (error) {
        return baseResponse(res, false, 500, "Error updating spot", error);
    }
};

exports.deleteSpot = async (req, res) => {
    try {
        const spot = await spotModel.deleteSpot(req.params.id);
        if (!spot) {
            return baseResponse(res, false, 404, "Spot not found", null);
        }
        return baseResponse(res, true, 200, "Spot deleted", spot);
    } catch (error) {
        return baseResponse(res, false, 500, "Error deleting spot", error);
    }
};

exports.getKategoriList = async (req, res) => {
    try {
        const categories = spotModel.getKategoriList();
        return baseResponse(res, true, 200, "Categories retrieved", categories);
    } catch (error) {
        return baseResponse(res, false, 500, "Error getting categories", error);
    }
};

exports.getLokasiList = async (req, res) => {
    try {
        const locations = spotModel.getLokasiList();
        return baseResponse(res, true, 200, "Locations retrieved", locations);
    } catch (error) {
        return baseResponse(res, false, 500, "Error getting locations", error);
    }
};