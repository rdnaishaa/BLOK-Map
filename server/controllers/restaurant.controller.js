const restaurantModel = require("../models/restaurant.model");
const baseResponse = require("../utils/baseResponse");

exports.createRestaurant = async (req, res) => {
    const { namaRestaurant, kategori, lokasi, informasiRestaurant } = req.body;
    try {
        const restaurant = await restaurantModel.createRestaurant({
            namaRestaurant,
            kategori,
            lokasi,
            informasiRestaurant
        });
        return baseResponse(res, true, 201, "Restaurant created", restaurant);
    } catch (error) {
        return baseResponse(res, false, 500, "Error creating restaurant", error);
    }
};

exports.getRestaurants = async (req, res) => {
    try {
        const { search, kategori, lokasi } = req.query;
        const restaurants = await restaurantModel.getRestaurants({ search, kategori, lokasi });
        return baseResponse(res, true, 200, "Restaurants found", restaurants);
    } catch (error) {
        return baseResponse(res, false, 500, "Error retrieving restaurants", error);
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await restaurantModel.getRestaurantById(req.params.id);
        if (!restaurant) {
            return baseResponse(res, false, 404, "Restaurant not found", null);
        }
        return baseResponse(res, true, 200, "Restaurant found", restaurant);
    } catch (error) {
        return baseResponse(res, false, 500, "Error retrieving restaurant", error);
    }
};

exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const { namaRestaurant, kategori, lokasi, informasiRestaurant } = req.body;
    try {
        const restaurant = await restaurantModel.updateRestaurant(id, {
            namaRestaurant,
            kategori,
            lokasi,
            informasiRestaurant
        });
        if (!restaurant) {
            return baseResponse(res, false, 404, "Restaurant not found", null);
        }
        return baseResponse(res, true, 200, "Restaurant updated", restaurant);
    } catch (error) {
        return baseResponse(res, false, 500, "Error updating restaurant", error);
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await restaurantModel.deleteRestaurant(req.params.id);
        if (!restaurant) {
            return baseResponse(res, false, 404, "Restaurant not found", null);
        }
        return baseResponse(res, true, 200, "Restaurant deleted", restaurant);
    } catch (error) {
        return baseResponse(res, false, 500, "Error deleting restaurant", error);
    }
};

exports.getKategoriList = async (req, res) => {
    try {
        const categories = restaurantModel.getKategoriList();
        return baseResponse(res, true, 200, "Categories retrieved", categories);
    } catch (error) {
        return baseResponse(res, false, 500, "Error getting categories", error);
    }
};

exports.getLokasiList = async (req, res) => {
    try {
        const locations = restaurantModel.getLokasiList();
        return baseResponse(res, true, 200, "Locations retrieved", locations);
    } catch (error) {
        return baseResponse(res, false, 500, "Error getting locations", error);
    }
};