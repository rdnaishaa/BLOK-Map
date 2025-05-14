const restaurantModel = require("../models/restaurant.model");
const BaseResponse = require("../utils/baseResponse.util");

exports.createRestaurant = async (req, res) => {
    const { namaRestaurant, kategori, lokasi, rating, price, informasiRestaurant } = req.body;

    if (!/^\[\d+,\s*\d+\]$/.test(price)) {
        return res.status(400).json({
            success: false,
            message: "Invalid price format. Use [min, max] format."
        });
    }

    try {
        const restaurant = await restaurantModel.createRestaurant({
            namaRestaurant,
            kategori,
            lokasi,
            rating,
            price,
            informasiRestaurant
        });
        return BaseResponse(res, true, 201, "Restaurant created successfully", restaurant);
    } catch (error) {
        console.error("Error creating restaurant:", error);
        return BaseResponse(res, false, 500, "Error creating restaurant", error.message);
    }
};

exports.getRestaurants = async (req, res) => {
    try {
        const { search = '', kategori = '', lokasi = '' } = req.query;
        if (typeof search !== 'string' || typeof kategori !== 'string' || typeof lokasi !== 'string') {
            return BaseResponse(res, false, 400, "Invalid query parameters", null);
        }
        const restaurants = await restaurantModel.getRestaurants({ search, kategori, lokasi });
        return BaseResponse(res, true, 200, "Restaurants retrieved successfully", restaurants);
    } catch (error) {
        console.error("Error retrieving restaurants:", error);
        return BaseResponse(res, false, 500, "Error retrieving restaurants", error.message);
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await restaurantModel.getRestaurantById(req.params.id);
        if (!restaurant) {
            return BaseResponse(res, false, 404, "Restaurant not found", null);
        }
        return BaseResponse(res, true, 200, "Restaurant retrieved successfully", restaurant);
    } catch (error) {
        console.error("Error retrieving restaurant:", error);
        return BaseResponse(res, false, 500, "Error retrieving restaurant", error.message);
    }
};

exports.updateRestaurantFields = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body; 

    if (Object.keys(fields).length === 0) {
      return BaseResponse(res, false, 400, "No fields provided for update", null);
    }

    const updatedRestaurant = await restaurantModel.updateRestaurantFields(id, fields);

    if (!updatedRestaurant) {
      return BaseResponse(res, false, 404, "Restaurant not found", null);
    }

    return BaseResponse(res, true, 200, "Restaurant updated successfully", updatedRestaurant);
  } catch (error) {
    console.error("Error updating restaurant fields:", error);
    return BaseResponse(res, false, 500, "Error updating restaurant fields", error.message);
  }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await restaurantModel.deleteRestaurant(req.params.id);
        if (!restaurant) {
            return BaseResponse(res, false, 404, "Restaurant not found", null);
        }
        return BaseResponse(res, true, 200, "Restaurant deleted successfully", restaurant);
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        return BaseResponse(res, false, 500, "Error deleting restaurant", error.message);
    }
};