import api from './api'

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials, {
      withCredentials: true
    })
    return response.data.payload
  } catch (error) {
    console.error('Login error:', error)
    throw error.response?.data || error
  }
}

export const registerUser = async (userData) => {
  try {
    // Hanya kirim field yang dibutuhkan backend
    const response = await api.post('/auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name
    }, {
      withCredentials: true
    });
    return response.data.payload;
  } catch (error) {
    console.error('Registration error:', error)
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me', {
      withCredentials: true
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
    console.error('Update user error:', error)
    throw error.response?.data || error
  }
}

export const deleteUser = async (userId, userData) => {
  try {
    const response = await api.delete(`/auth/delete/${userId}`, {
      data: userData, // ✅ PERBAIKI: data harus dalam object config
      withCredentials: true
    })
    return response.data.payload
  } catch (error) {
    console.error('Delete user error:', error)
    throw error.response?.data || error
  }
}

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout', {}, { // ✅ TAMBAHKAN empty data object dan config
      withCredentials: true
    }) 
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    throw error.response?.data || error
  }
}