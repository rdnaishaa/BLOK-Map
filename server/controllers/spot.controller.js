const spotModel  = require("../models/spot.model");
const baseResponse = require("../utils/baseResponse");

exports.createSpot = async (req, res) => {
  const { 
    namaHangout, 
    kategori, 
    lokasi, 
    informasiHangout, 
    price, 
    type, 
    artikel 
  } = req.body;
  
  const image = req.file;
  
  try {
    // Validate kategori and lokasi
    const validKategori = spotModel .getKategoriList().includes(kategori);
    const validLokasi = spotModel .getLokasiList().includes(lokasi);
    
    if (!validKategori || !validLokasi) {
      return baseResponse(res, false, 400, "Invalid kategori or lokasi", null);
    }
    
    const spot = await spotModel .createSpot(
      { namaHangout, kategori, lokasi, informasiHangout, price, type, artikel },
      image
    );
    
    return baseResponse(res, true, 201, "Spot created successfully", spot);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating spot", error);
  }
};

exports.getAllSpots = async (req, res) => {
  try {
    const spots = await spotModel .getAllSpots(req.query);
    const categories = await spotModel .getKategoriList();
    const location = await spotModel .getLokasiList();
    
    return baseResponse(res, true, 200, "Spots retrieved successfully", {
      spots,
      categories,
      location,
      search_query: req.query.search || '',
      selected_kategori: req.query.kategori || '',
      selected_lokasi: req.query.lokasi || ''
    });
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving spots", error);
  }
};

exports.getSpotById = async (req, res) => {
  try {
    const spot = await spotModel .getSpotById(req.params.id);
    if (!spot) {
      return baseResponse(res, false, 404, "Spot not found", null);
    }
    return baseResponse(res, true, 200, "Spot retrieved successfully", spot);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving spot", error);
  }
};

exports.updateSpot = async (req, res) => {
  const { id } = req.params;
  const image = req.file;
  
  try {
    const spot = await spotModel .updateSpot(
      id,
      req.body,
      image
    );
    
    if (!spot) {
      return baseResponse(res, false, 404, "Spot not found", null);
    }
    
    return baseResponse(res, true, 200, "Spot updated successfully", spot);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating spot", error);
  }
};

exports.deleteSpot = async (req, res) => {
  try {
    const spot = await spotModel .deleteSpot(req.params.id);
    
    if (!spot) {
      return baseResponse(res, false, 404, "Spot not found", null);
    }
    
    return baseResponse(res, true, 200, "Spot deleted successfully", spot);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting spot", error);
  }
};

exports.getKategoriList = async (req, res) => {
  try {
    const categories = await spotModel .getKategoriList();
    return baseResponse(res, true, 200, "Kategori list retrieved", categories);
  } catch (error) {
    return baseResponse(res, false, 500, "Error getting kategori list", error);
  }
};

exports.getLokasiList = async (req, res) => {
  try {
    const location = await spotModel .getLokasiList();
    return baseResponse(res, true, 200, "Lokasi list retrieved", location);
  } catch (error) {
    return baseResponse(res, false, 500, "Error getting lokasi list", error);
  }
};