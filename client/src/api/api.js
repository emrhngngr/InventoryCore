import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for all requests
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token
    if (token) {
      config.headers.Authorization = token; // Add token to header
    }
    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
      // If token expired or unauthorized
      localStorage.removeItem("token"); // Remove token
      window.location.href = "/login"; // Redirect to login page
  }
  return Promise.reject(error);
  }
);

export default api;
