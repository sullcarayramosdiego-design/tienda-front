'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import type { RegisterData, LoginData, User } from '@/types/api';

/**
 * Hook de autenticación para gestionar el estado del usuario
 * y las operaciones de login/logout/register
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verificar autenticación al cargar el componente
   */
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          // Obtener datos actualizados del usuario
          const userData = await usersService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Error al verificar autenticación:', err);
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Registrar un nuevo usuario
   */
  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(data);
      setUser(response.user);
      
      return response;
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message || 'Error al registrar usuario'
        : 'Error al registrar usuario';
      const errorMessage = Array.isArray(message) ? message.join(', ') : message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Iniciar sesión
   */
  const login = useCallback(async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(data);
      setUser(response.user);
      
      return response;
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message || 'Credenciales inválidas'
        : 'Credenciales inválidas';
      const errorMessage = Array.isArray(message) ? message.join(', ') : message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  /**
   * Refrescar datos del usuario
   */
  const refreshUser = useCallback(async () => {
    if (!authService.isAuthenticated()) return;
    
    try {
      const userData = await usersService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error('Error al refrescar usuario:', err);
    }
  }, []);

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
  };
}

export default useAuth;
