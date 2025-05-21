import api from './api'

export const getSpots = async (params = {}) => {
  try {
    const response = await api.get('/spots', { params });
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching spots:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch spots');
  }
}

export const getSpotById = async (id) => {
  try {
    const response = await api.get(`/spots/${id}`)
    if (!response.data) {
      throw new Error('No data received from server')
    }
    return response.data
  } catch (error) {
    console.error(`Error fetching spot ${id}:`, error)
    throw error
  }
}

export const getKategoriList = async () => {
  try {
    const response = await api.get('/spots/categories/list');
    if (!response.data) {
      throw new Error('No categories data received');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, payload: [] };
  }
}

export const getLokasiList = async () => {
  try {
    const response = await api.get('/spots/locations/list');
    if (!response.data) {
      throw new Error('No locations data received');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return { success: false, payload: [] };
  }
}

export const createSpot = async (spotData) => {
  try {
    const response = await api.post('/spots', spotData)
    return response.data
  } catch (error) {
    console.error('Error creating spot:', error)
    throw error
  }
}

export const updateSpot = async (id, updateData) => {
  try {
    const response = await api.patch(`/spots/${id}`, updateData)
    return response.data
  } catch (error) {
    console.error(`Error updating spot ${id}:`, error)
    throw error
  }
}

export const deleteSpot = async (id) => {
  try {
    const response = await api.delete(`/spots/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting spot ${id}:`, error)
    throw error
  }
}