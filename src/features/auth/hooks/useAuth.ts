'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { authService } from '@/features/auth/services/auth.service';
import { usersService } from '@/features/auth/services/users.service';
import type { RegisterData, LoginData, User } from '@/types/api';
import { useToast } from '@/components/ui/toast';

/**
 * Promesa global para sincronizar el retraso artificial en todos los hooks activos
 */
let authDelayPromise: Promise<void> | null = null;

/**
 * Hook de autenticación para gestionar el estado del usuario
 * y las operaciones de login/logout/register
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verificar autenticación al cargar el componente
   */
  useEffect(() => {
    // Si NextAuth todavía está cargando, esperamos
    if (status === 'loading') return;

    const checkAuth = async () => {
      // Forzamos la sincronización aquí también por si el AuthSync de GlobalProvider tardó
      if (session && (session as any).backendTokens) {
        const tokens = (session as any).backendTokens;
        if (tokens.accessToken && localStorage.getItem('access_token') !== tokens.accessToken) {
          localStorage.setItem('access_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);
          if (tokens.user) {
            localStorage.setItem('user', JSON.stringify(tokens.user));
            // Mostrar Toast de bienvenida al iniciar sesión con Google
            toast({
              title: "¡Bienvenido de vuelta!",
              description: `Has iniciado sesión correctamente como ${tokens.user.firstName || tokens.user.name}.`,
            });
          }
          
          // Iniciar la promesa global de 5 segundos
          if (!authDelayPromise) {
            authDelayPromise = new Promise(resolve => {
              setTimeout(() => {
                authDelayPromise = null;
                resolve();
              }, 5000);
            });
          }
        }
      }

      if (authService.isAuthenticated()) {
        try {
          // Obtener datos actualizados del usuario
          const userData = await usersService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Error al verificar autenticación:', err);
          authService.logout();
          signOut({ redirect: false });
        }
      } else {
        setUser(null);
      }
      
      // Esperar al retraso artificial global (si fue activado por este u otro componente)
      if (authDelayPromise) {
        await authDelayPromise;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [session, status]);

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
  const logout = useCallback(async () => {
    setLoading(true);
    
    // Añadir retraso artificial para que el usuario aprecie el loader
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    authService.logout();
    setUser(null);
    await signOut({ callbackUrl: '/login' });
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
