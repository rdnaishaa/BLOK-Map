import api from './api'

export const getSpots = async (params = {}) => {
  try {
    const response = await api.get('/spots', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching spots:', error);
    throw error;
  }
}

export const getKategoriList = async () => {
  try {
    const response = await api.get('/spots/categories/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export const getLokasiList = async () => {
  try {
    const response = await api.get('/spots/locations/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}

export const getSpotById = async (id) => {
  try {
    const response = await api.get(`/spots/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching spot:', error);
    throw error;
  }
}

export const addSpot = async (spotData, token) => {
  try {
    const response = await api.post('/spots', spotData, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
    return response.data;
  } catch (error) {
    console.error('Error creating spot:', error);
    throw error;
  }
};

export const editSpot = async (spotData, token) => {
  try {
    const { id, ...fields } = spotData;
    const response = await api.patch(`/spots/${id}`, fields, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
    return response.data;
  } catch (error) {
    console.error('Error updating spot:', error);
    throw error;
  }
};

export const deleteSpot = async (id, token) => {
  try {
    const response = await api.delete(`/spots/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
    return response.data;
  } catch (error) {
    console.error('Error deleting spot:', error);
    throw error;
  }
};