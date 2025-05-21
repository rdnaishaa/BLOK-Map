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