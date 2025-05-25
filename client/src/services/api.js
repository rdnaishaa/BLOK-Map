import axios from 'axios'

const API_URL = 'http://localhost:3000'
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false 
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      endpoint: error.config?.url
    });
    return Promise.reject(error);
  }
)

export default api

export const getRestaurants = async (params = {}) => {
  try {
    const response = await api.get('/restaurants', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getRestaurantById = async (id) => {
  try {
    const response = await api.get(`/restaurants/${id}`)
    return response.data
  } catch (error) {
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

export const getSpotArticles = async (spotId) => {
  try {
    const response = await api.get(`/articles/spot/${spotId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching spot articles:', error)
    throw error
  }
}

export const getSpots = async (params = {}) => {
  try {
    const response = await api.get('/spots', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching spots:', error)
    throw error
  }
}

export const getKategoriList = async () => {
  try {
    const response = await api.get('/spots/categories/list')
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const getLokasiList = async () => {
  try {
    const response = await api.get('/spots/locations/list')
    return response.data
  } catch (error) {
    console.error('Error fetching locations:', error)
    throw error
  }
}