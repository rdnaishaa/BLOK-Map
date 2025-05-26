import api from './api'

export const getArticles = async () => {
  try {
    const response = await api.get('/articles')
    return response.data
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}

export const getRestaurantArticles = async () => {
  try {
    const response = await api.get('/articles/restaurants')
    return response.data
  } catch (error) {
    console.error('Error fetching restaurant articles:', error)
    throw error
  }
}

export const getSpotArticles = async () => {
  try {
    const response = await api.get('/articles/spots')
    return response.data
  } catch (error) {
    console.error('Error fetching spot articles:', error)
    throw error
  }
}

export const getRestaurantArticleById = async (id) => {
  try {
    const response = await api.get(`/articles/restaurant/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching restaurant article ${id}:`, error)
    throw error
  }
}

export const getSpotArticleById = async (id) => {
  try {
    const response = await api.get(`/articles/spot/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching spot article ${id}:`, error)
    throw error
  }
}

export const createArticle = async (data) => {
  try {
    // Use FormData to handle file uploads
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key !== 'image') {
        formData.append(key, data[key])
      }
    })
    if (data.image instanceof File) {
      formData.append('image', data.image)
    }
    const response = await api.post('/articles/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error creating article:', error)
    throw error
  }
}

export const updateArticle = async (id, data) => {
  try {
    const response = await api.patch(`/articles/update/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating article ${id}:`, error)
    throw error
  }
}

export const updateArticleImage = async (id, imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.put(`/articles/update/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error(`Error updating article image ${id}:`, error)
    throw error
  }
}

export const deleteArticle = async (id) => {
  try {
    const response = await api.delete(`/articles/delete/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting article ${id}:`, error)
    throw error
  }
}

export const addRestaurantArticle = async (data, token) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key !== 'image') {
        formData.append(key, data[key]);
      }
    });
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    const response = await api.post('/articles/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding restaurant article:', error);
    throw error;
  }
};

export const editRestaurantArticle = async (data, token) => {
  try {
    const { id, judul, konten, kategori, lokasi } = data;
    // Debug token dan data
    console.log('editRestaurantArticle token:', token);
    console.log('editRestaurantArticle data:', { id, judul, konten, kategori, lokasi });
    if (!token) {
      console.warn('No token provided to editRestaurantArticle!');
      return { success: false, message: 'No token provided' };
    }
    if (!id || !judul || !konten) {
      console.warn('Ada field kosong:', { id, judul, konten });
      return { success: false, message: 'ID, judul, dan konten harus diisi!' };
    }
    // Kirim field yang valid
    const payload = { title: judul, content: konten, category: kategori, location: lokasi };
    if (data.restaurant_id) payload.restaurant_id = data.restaurant_id;
    if (data.author_id) payload.author_id = data.author_id;
    console.log('Payload PATCH:', payload);
    const response = await api.patch(
      `/articles/update/${id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error editing restaurant article:', error);
    throw error;
  }
};