import axios from 'axios';

// Base API configuration

// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = import.meta.env.VITE_BASE_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/token/', credentials),
  refreshToken: (refreshToken) => api.post('/api/token/refresh/', { refresh: refreshToken }),
  signup: (userData) => api.post('/api/users/signup/', userData),
};

// Orders endpoints
export const ordersAPI = {

  uploadCSV: (file) => {
    console.log("uploaded file",file)
    const formData = new FormData();
    formData.append('file', file);
    // Don't set Content-Type header, let the browser set it automatically with the boundary
    return api.post('/api/orders/upload-csv/', formData,{
      headers: {
        'Content-Type': undefined, // Let the browser set it (it will include proper boundaries)
      },
    });
  },
};

// Reviews endpoints
export const reviewsAPI = {
  getWidgetIframe: (userId) => api.get(`/api/reviews/widget/iframe/${userId}/`),
  submitReview: (token, reviewData) => api.post(`/api/reviews/review/${token}/`, reviewData),
  getPublicReviews: (userId) => api.get(`/api/reviews/public-reviews/${userId}/`),
  getUserReviews: () => api.get('/api/reviews/my-reviews/'),
  replyToNegativeReview: (reviewId, reply) => 
    api.post(`/api/reviews/reply-to-negative/${reviewId}/`, { reply }),
};

// User endpoints (additional endpoints that might be needed)
export const userAPI = {
  getProfile: () => api.get('/api/users/profile/'),
  updateProfile: (profileData) => api.put('/api/users/profile/', profileData),
  getBilling: () => api.get('/api/users/billing/'),
};

export default api;