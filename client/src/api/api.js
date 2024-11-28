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
    if (error.response?.status === 401) {
      // Token süresi dolmuşsa veya yetkisiz erişim varsa
      localStorage.removeItem("token"); // Token'ı kaldır
      window.location.href = "/login"; // Giriş sayfasına yönlendir
  }
  return Promise.reject(error);
  }
);

export default api;
