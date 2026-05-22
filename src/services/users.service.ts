import apiClient from '@/lib/api-client';
import type { User, UpdateUserData, ApiResponse } from '@/types/api';

/**
 * Servicio para gestión de usuarios
 */
export const usersService = {
  /**
   * Obtener perfil del usuario autenticado actual
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    
    // Actualizar localStorage con datos frescos
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data.data;
  },

  /**
   * Obtener un usuario por ID
   */
  async getById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Actualizar información del usuario
   */
  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, data);
    
    // Si se actualiza el usuario actual, actualizar localStorage
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.id === id) {
          localStorage.setItem('user', JSON.stringify(response.data.data));
        }
      }
    }
    
    return response.data.data;
  },

  /**
   * Eliminar un usuario (requiere rol ADMIN)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  /**
   * Actualizar perfil del usuario autenticado
   */
  async updateProfile(data: UpdateUserData): Promise<User> {
    const currentUser = await this.getCurrentUser();
    return this.update(currentUser.id, data);
  },
};

export default usersService;
