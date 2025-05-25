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
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });
  return await response.json();
};

export const updateReview = async (id, reviewData, token) => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });
  return await response.json();
};

export const deleteReview = async (id, token) => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};