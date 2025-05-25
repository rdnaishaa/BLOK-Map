import api from './api'

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials, {
      withCredentials: true
    })
    return response.data.payload
  } catch (error) {
    throw error.response?.data || error
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData, {
      withCredentials: true
    })
    return response.data.payload
  } catch (error) {
    throw error.response?.data || error
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me', {
      withCredentials: true, // ⬅️ cookie login dikirim
    })
    return response.data.payload
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return null
  }
}

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.patch(`/auth/update/${userId}`, userData, {
      withCredentials: true
    })
    return response.data.payload
  } catch (error) {
    throw error.response?.data || error
  }
}

export const deleteUser = async (userId, userData) => {
  try {
    const response = await api.delete(`/auth/delete/${userId}`, userData, {
      withCredentials: true
    })
    return response.data.payload
  } catch (error) {
    throw error.response?.data || error
  }
}

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout') 
  } catch (error) {
    console.error('Logout error:', error)
  }
}
