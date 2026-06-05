import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const prefix = process.env.NEXT_PUBLIC_API_PREFIX || '';
const API_BASE_URL = prefix ? `${baseUrl}/${prefix}` : baseUrl;

if (typeof window !== 'undefined') {
  console.log('🔌 [API Client] Conectado a API_BASE_URL:', API_BASE_URL);
}

/**
 * Cliente HTTP configurado con interceptores para autenticación JWT
 * y manejo automático de refresh tokens
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
});

/**
 * Interceptor para agregar token JWT automáticamente a todas las peticiones
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor para manejar errores 401 y refrescar tokens automáticamente
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 (Unauthorized) y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = typeof window !== 'undefined' 
          ? localStorage.getItem('refresh_token') 
          : null;
        
        if (!refreshToken) {
          // No hay refresh token, redirigir al login
          if (typeof window !== 'undefined' && !originalRequest.headers?.['x-skip-auth-redirect']) {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        // Intentar refrescar el token
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = data.data.accessToken;

        // Guardar nuevo access token
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', newAccessToken);
        }

        // Reintentar la petición original con el nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh falló, cerrar sesión
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          if (!originalRequest.headers?.['x-skip-auth-redirect']) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
