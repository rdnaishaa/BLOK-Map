import api from './api'

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response.data.payload
  } catch (error) {
    throw error.response?.data || error
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData)
    return response.data.payload
  } catch (error) {
    throw error.response?.data || error
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data.payload
  } catch (error) {
    throw error.response?.data || error
  }
}

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.patch(`/auth/update/${userId}`, userData)
    return response.data.payload
  } catch (error) {
    throw error.response?.data || error
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/auth/delete/${userId}`)
    return response.data.payload
  } catch (error) {
    throw error.response?.data || error
  }
}

export const logoutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
