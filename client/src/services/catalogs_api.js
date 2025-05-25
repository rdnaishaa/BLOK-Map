import api from './api'

export const getCatalogs = async (params = {}) => {
  try {
    const response = await api.get('/catalogs', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching catalogs:', error)
    throw error
  }
}

export const getCatalogsDetail = async (id) => {
  try {
    const response = await api.get(`/catalogs/${id}`)
    console.log('Catalog detail response:', response) // For debugging
    return response.data
  } catch (error) {
    console.error(`Error fetching catalog ${id}:`, error)
    throw error
  }
}

export const getCatalogsByRestaurantId = async (restaurantId) => {
  try {
    const response = await api.get(`/catalogs/restaurant/${restaurantId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching catalogs for restaurant ${restaurantId}:`, error)
    throw error
  }
}

export const createCatalog = async (catalogData) => {
  try {
    const response = await api.post('/catalogs', catalogData)
    return response.data
  } catch (error) {
    console.error('Error creating catalog:', error)
    throw error
  }
}   

export const updateCatalog = async (id, updateData) => {
  try {
    const response = await api.patch(`/catalogs/${id}`, updateData)
    return response.data
  } catch (error) {
    console.error(`Error updating catalog ${id}:`, error)
    throw error
  }
}

export const deleteCatalog = async (id) => {
  try {
    const response = await api.delete(`/catalogs/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting catalog ${id}:`, error)
    throw error
  }
}

export const addCatalog = async (catalogData, token) => {
  try {
    const response = await api.post('/catalogs', catalogData, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
    return response.data
  } catch (error) {
    console.error('Error creating catalog:', error)
    throw error
  }
}

export const editCatalog = async (catalogData, token) => {
  try {
    const { id, ...fields } = catalogData
    const response = await api.patch(`/catalogs/${id}`, fields, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
    return response.data
  } catch (error) {
    console.error('Error updating catalog:', error)
    throw error
  }
}