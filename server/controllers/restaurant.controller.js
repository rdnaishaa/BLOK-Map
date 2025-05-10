const restaurantModel = require("../models/restaurant.model");
const baseResponse = require("../utils/baseResponse");

exports.createRestaurant = async (req, res) => {
  const { 
    namaRestaurant, 
    kategori, 
    lokasi, 
    informasiRestaurant, 
    price, 
    type, 
    artikel 
  } = req.body;
  
  const image = req.file;
  
  try {
    // Validate kategori and lokasi
    const validKategori = restaurantModel .getKategoriList().includes(kategori);
    const validLokasi = restaurantModel .getLokasiList().includes(lokasi);
    
    if (!validKategori || !validLokasi) {
      return baseResponse(res, false, 400, "Invalid kategori or lokasi", null);
    }
    
    const restaurant = await restaurantModel .createRestaurant(
      { namaRestaurant, kategori, lokasi, informasiRestaurant, price, type, artikel },
      image
    );
    
    return baseResponse(res, true, 201, "Restaurant created successfully", restaurant);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating restaurant", error);
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel .getAllRestaurants(req.query);
    const categories = await restaurantModel .getKategoriList();
    const location = await restaurantModel .getLokasiList();
    
    return baseResponse(res, true, 200, "Restaurants retrieved successfully", {
      restaurants,
      categories,
      location,
      search_query: req.query.search || '',
      selected_kategori: req.query.kategori || '',
      selected_lokasi: req.query.lokasi || '',
      selected_type: req.query.type || ''
    });
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving restaurants", error);
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantModel .getRestaurantById(req.params.id);
    if (!restaurant) {
      return baseResponse(res, false, 404, "Restaurant not found", null);
    }
    return baseResponse(res, true, 200, "Restaurant retrieved successfully", restaurant);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving restaurant", error);
  }
};

exports.updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const image = req.file;
  
  try {
    const restaurant = await restaurantModel .updateRestaurant(
      id,
      req.body,
      image
    );
    
    if (!restaurant) {
      return baseResponse(res, false, 404, "Restaurant not found", null);
    }
    
    return baseResponse(res, true, 200, "Restaurant updated successfully", restaurant);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating restaurant", error);
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantModel .deleteRestaurant(req.params.id);
    
    if (!restaurant) {
      return baseResponse(res, false, 404, "Restaurant not found", null);
    }
    
    return baseResponse(res, true, 200, "Restaurant deleted successfully", restaurant);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting restaurant", error);
  }
};

exports.getKategoriList = async (req, res) => {
  try {
    const categories = await restaurantModel .getKategoriList();
    return baseResponse(res, true, 200, "Kategori list retrieved", categories);
  } catch (error) {
    return baseResponse(res, false, 500, "Error getting kategori list", error);
  }
};

exports.getLokasiList = async (req, res) => {
  try {
    const location = await restaurantModel .getLokasiList();
    return baseResponse(res, true, 200, "Lokasi list retrieved", location);
  } catch (error) {
    return baseResponse(res, false, 500, "Error getting lokasi list", error);
  }
};