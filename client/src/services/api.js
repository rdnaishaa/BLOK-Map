import axios from 'axios'

const API_URL = 'http://localhost:3000'
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

api.interceptors.request.use(
  (config) => {
    // Ambil user dari localStorage dan ambil token dari user jika ada
    let token = localStorage.getItem('token');
    if (!token) {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          token = JSON.parse(user).token;
        } catch {}
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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

export default api