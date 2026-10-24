import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // FastAPI URL
});

// Interceptor to add the Authorization header with the token for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend rejects the token (expired, revoked, invalid), clear the
// local session and send the user back to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
