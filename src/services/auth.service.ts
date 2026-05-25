import apiClient from '@/lib/api-client';
import type { 
  RegisterData, 
  LoginData, 
  AuthResponse,
  ApiResponse
} from '@/types/api';

/**
 * Servicio de autenticación para gestión de usuarios y tokens JWT
 */
export const authService = {
  /**
   * Registrar un nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    
    // Guardar tokens en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.data.accessToken);
      localStorage.setItem('refresh_token', response.data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  /**
   * Iniciar sesión con email y contraseña
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    
    // Guardar tokens en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.data.accessToken);
      localStorage.setItem('refresh_token', response.data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  },

  /**
   * Refrescar el access token usando el refresh token
   */
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken,
    });
    
    // Actualizar access token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.data.accessToken);
    }
    
    return response.data.data;
  },

  /**
   * Cerrar sesión y limpiar tokens
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  },

  /**
   * Obtener el token JWT actual
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  /**
   * Obtener el refresh token actual
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },

  /**
   * Obtener el usuario actual desde localStorage
   */
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};

export default authService;
