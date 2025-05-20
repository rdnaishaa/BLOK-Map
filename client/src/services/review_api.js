import api from './api'

export const getReviews = async (params = {}) => {
  try {
    const response = await api.get('/reviews', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}

export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData)
    return response.data
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

export const updateReview = async (id, reviewData) => {
  try {
    const response = await api.patch(`/reviews/${id}`, reviewData)
    return response.data
  } catch (error) {
    console.error(`Error updating review ${id}:`, error)
    throw error
  }
}

export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting review ${id}:`, error)
    throw error
  }
}