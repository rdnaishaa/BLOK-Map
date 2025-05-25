import api from './api'

export const getReviews = async (params = {}) => {
  try {
    const response = await api.get('/reviews', { params });
    if (!response.data) {
      throw new Error('No reviews data received');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

export const getReviewsByRestaurantId = async (restaurantId) => {
  try {
    const response = await api.get(`/reviews/restaurant/${restaurantId}`);
    if (!response.data) {
      throw new Error('No reviews data received');
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for restaurant ${restaurantId}:`, error);
    throw error;
  }
}

export const getReviewsBySpotId = async (spotId) => {
  try {
    const response = await api.get(`/reviews/spot/${spotId}`);
    if (!response.data) {
      throw new Error('No reviews data received');
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for spot ${spotId}:`, error);
    throw error;
  }
}

export const createReview = async (reviewData, token) => {
  try {
    const response = await api.post('/reviews', reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const updateReview = async (id, reviewData, token) => {
  try {
    const response = await api.patch(`/reviews/${id}`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const deleteReview = async (id, token) => {
  try {
    const response = await api.delete(`/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};