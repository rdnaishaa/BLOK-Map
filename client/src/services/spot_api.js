import api from './api'

export const getSpots = async (params = {}) => {
  try {
    const response = await api.get('/spots', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching spots:', error)
    throw error
  }
}

export const getSpotById = async (id) => {
  try {
    const response = await api.get(`/spots/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching spot ${id}:`, error)
    throw error
  }
}

export const getKategoriList = async () => {
  try {
    const response = await api.get('/spots/categories/list')
    return response.data
  } catch (error) {
    console.error('Error fetching kategori list:', error)
    throw error
  }
}

export const getLokasiList = async () => {
  try {
    const response = await api.get('/spots/locations/list')
    return response.data
  } catch (error) {
    console.error('Error fetching lokasi list:', error)
    throw error
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