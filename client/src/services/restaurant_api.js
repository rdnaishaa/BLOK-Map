import api from './api'

export const getRestaurants = async (params = {}) => {
  try {
    const response = await api.get('/restaurant', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    throw error
  }
}

export const getRestaurantById = async (id) => {
  try {
    const response = await api.get(`/restaurant/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching restaurant ${id}:`, error)
    throw error
  }
}

export const createRestaurant = async (restaurantData) => {
  try {
    const response = await api.post('/restaurant', restaurantData)
    return response.data
  } catch (error) {
    console.error('Error creating restaurant:', error)
    throw error
  }
}

export const updateRestaurant = async (id, updateData) => {
  try {
    const response = await api.patch(`/restaurant/${id}`, updateData)
    return response.data
  } catch (error) {
    console.error(`Error updating restaurant ${id}:`, error)
    throw error
  }
}

export const deleteRestaurant = async (id) => {
  try {
    const response = await api.delete(`/restaurant/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting restaurant ${id}:`, error)
    throw error
  }
}