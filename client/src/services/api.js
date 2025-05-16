import axios from 'axios'

const API_URL = import.meta.env.PROD 
  ? 'https://blok-map.vercel.app/api'
  : 'http://localhost:3000'  

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
})


// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor
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
);

// Articles
export const getArticles = () => api.get('/articles')
export const createArticle = (data) => api.post('/articles/create', data)
export const updateArticle = (id, data) => api.patch(`/articles/update/${id}`, data)
export const deleteArticle = (id) => api.delete(`/articles/delete/${id}`)

// Auth
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const getCurrentUser = () => api.get('/auth/me')
export const updateUser = (id, data) => api.patch(`/auth/update/${id}`, data)
export const deleteUser = (id) => api.delete(`/auth/delete/${id}`)

// Catalogs
export const getCatalogs = (params = {}) => api.get('/catalogs', { params })
export const getCatalogById = (id) => api.get(`/catalogs/${id}`)
export const createCatalog = (data) => api.post('/catalogs', data)
export const updateCatalog = (id, data) => api.patch(`/catalogs/${id}`, data)
export const deleteCatalog = (id) => api.delete(`/catalogs/${id}`)

// Restaurants
export const getRestaurants = (params = {}) => api.get('/restaurant', { params })
export const getRestaurantById = (id) => api.get(`/restaurant/${id}`)
export const createRestaurant = (data) => api.post('/restaurant', data)
export const updateRestaurant = (id, data) => api.patch(`/restaurant/${id}`, data)
export const deleteRestaurant = (id) => api.delete(`/restaurant/${id}`)
export const getRestaurantArticles = (id) => api.get(`/articles?restaurant_id=${id}`)
export const getRestaurantReviews = (id) => api.get(`/reviews?resto_id=${id}`)

// Reviews
export const getReviews = async (params = {}) => {
  try {
    // Convert exists params to proper query parameters
    const queryParams = {}
    if (params.resto_id === 'exists') {
      queryParams.resto_id = 'not.is.null'
    }
    if (params.spot_id === 'exists') {
      queryParams.spot_id = 'not.is.null'
    }
    
    const response = await api.get('/reviews', { 
      params: {
        ...params,
        ...queryParams
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { data: [] } // Return empty array as fallback
  }
}
export const createReview = (data) => api.post('/reviews', data)
export const updateReview = (id, data) => api.patch(`/reviews/${id}`, data)
export const deleteReview = (id) => api.delete(`/reviews/${id}`)

// Spots
export const getSpots = (params = {}) => api.get('/spots', { params })
export const getSpotById = (id) => api.get(`/spots/${id}`)
export const createSpot = (data) => api.post('/spots', data)
export const updateSpot = (id, data) => api.patch(`/spots/${id}`, data)
export const deleteSpot = (id) => api.delete(`/spots/${id}`)
export const getSpotArticles = (id) => api.get(`/articles?spot_id=${id}`)
export const getSpotReviews = (id) => api.get(`/reviews?spot_id=${id}`)
export const getSpotCategories = () => api.get('/spots/categories/list')
export const getSpotLocations = () => api.get('/spots/locations/list')

export default api