import axios from 'axios'

const API_URL = 'https://blok-map.vercel.app/'  
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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

// Articles
export const getArticles = () => api.get('articles')
export const createArticle = (data) => api.post('articles/create', data)
export const updateArticle = (id, data) => api.patch(`articles/update/${id}`, data)
export const deleteArticle = (id) => api.delete(`articles/delete/${id}`)

// Auth
export const registerUser = (data) => api.post('auth/register', data)
export const loginUser = (data) => api.post('auth/login', data)
export const getCurrentUser = () => api.get('auth/me')
export const updateUser = (id, data) => api.patch(`auth/update/${id}`, data)
export const deleteUser = (id) => api.delete(`auth/delete/${id}`)

// Catalogs
export const getCatalogs = async (params = {}) => {
  try {
    // Clean and format params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value != null && value !== '')
    )
    if (cleanParams.maxHarga) {
      cleanParams.maxHarga = parseInt(cleanParams.maxHarga)
    }
    if (cleanParams.minHarga) {
      cleanParams.minHarga = parseInt(cleanParams.minHarga)
    }
    
    const response = await api.get('catalogs', { 
      params: cleanParams,
      paramsSerializer: params => {
        return Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      }
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching catalogs:', error)
    return []
  }
}
export const getCatalogById = (id) => api.get(`catalogs/${id}`)
export const createCatalog = (data) => api.post('catalogs', data)
export const updateCatalog = (id, data) => api.patch(`catalogs/${id}`, data)
export const deleteCatalog = (id) => api.delete(`catalogs/${id}`)

// Restaurants
export const getRestaurants = async (params = {}) => {
  try {
    const response = await api.get('restaurant', { params })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return []
  }
}

export const getRestaurantById = async (id) => {
  if (!id) return null
  try {
    const response = await api.get(`restaurant/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return null
  }
}

export const createRestaurant = (data) => api.post('restaurant', data)
export const updateRestaurant = (id, data) => api.patch(`restaurant/${id}`, data)
export const deleteRestaurant = (id) => api.delete(`restaurant/${id}`)

export const getRestaurantArticles = async (id) => {
  if (!id) return []
  try {
    const response = await api.get(`articles?restaurant_id=${id}`)
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching restaurant articles:', error)
    return []
  }
}

export const getRestaurantReviews = async (id) => {
  if (!id) return []
  try {
    const response = await api.get(`reviews?resto_id=${id}`)
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching restaurant reviews:', error)
    return []
  }
}

// Reviews
export const getReviews = async (params = {}) => {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value != null && value !== '')
    )
    
    const response = await api.get('reviews', { 
      params: cleanParams,
      paramsSerializer: params => {
        return Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      }
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}
export const createReview = (data) => api.post('reviews', data)
export const updateReview = (id, data) => api.patch(`reviews/${id}`, data)
export const deleteReview = (id) => api.delete(`reviews/${id}`)

// Spots (tanpa /api)
export const getSpots = async (params = {}) => {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value != null && value !== '')
    )
    const response = await api.get('spots', { 
      params: cleanParams,
      paramsSerializer: params => {
        return Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      }
    })
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching spots:', error)
    return []
  }
}
export const getSpotById = (id) => api.get(`spots/${id}`)
export const createSpot = (data) => api.post('spots', data)
export const updateSpot = (id, data) => api.patch(`spots/${id}`, data)
export const deleteSpot = (id) => api.delete(`spots/${id}`)
export const getSpotArticles = (id) => api.get(`articles?spot_id=${id}`)
export const getSpotReviews = (id) => api.get(`reviews?spot_id=${id}`)
export const getSpotCategories = async () => {
  try {
    const response = await api.get('spots/categories/list')
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching spot categories:', error)
    return []
  }
}
export const getSpotLocations = async () => {
  try {
    const response = await api.get('spots/locations/list')
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching spot locations:', error)
    return []
  }
}

export default api
