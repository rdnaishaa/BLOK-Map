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

export const createRestaurant = async (restaurantData, token) => {
  try {
    const response = await api.post('/restaurant', restaurantData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating restaurant:', error)
    throw error
  }
}

export const updateRestaurant = async (id, updateData, token) => {
  try {
    const response = await api.patch(`/restaurant/${id}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error updating restaurant ${id}:`, error)
    if (error.response && error.response.data) {
      return error.response.data
    }
    throw error
  }
}

export const deleteRestaurant = async (id, token) => {
  try {
    const response = await api.delete(`/restaurant/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error deleting restaurant ${id}:`, error)
    throw error
  }
}