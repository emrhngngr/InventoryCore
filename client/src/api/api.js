import axios from 'axios';

// Axios instance oluştur
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Tüm isteklerin temel URL'si
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Token'i al
    if (token) {
      config.headers.Authorization = token; // Header'a token ekle
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Hata durumunda işlemi reddet
  }
);

export default api;
