# Guía de Integración Frontend (Next.js) - E-Commerce 3D Backend

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Autenticación JWT](#autenticación-jwt)
3. [Endpoints Disponibles](#endpoints-disponibles)
4. [Ejemplos de Integración](#ejemplos-de-integración)
5. [Manejo de Errores](#manejo-de-errores)
6. [Variables de Entorno](#variables-de-entorno)

---

## 🚀 Configuración Inicial

### Requisitos Previos

- **Backend corriendo en:** `http://localhost:3000`
- **Frontend Next.js:** Puerto 3001 o 4200
- **CORS configurado para:** `http://localhost:4200,http://localhost:3001`

### Instalación de Dependencias (Next.js)

```bash
npm install axios
# o
pnpm add axios
```

### Estructura Recomendada

```
src/
├── lib/
│   ├── api-client.ts          # Cliente HTTP configurado
│   └── auth.ts                # Helpers de autenticación
├── hooks/
│   ├── useAuth.ts             # Hook de autenticación
│   └── useApi.ts              # Hook para llamadas API
└── types/
    └── api.ts                 # Tipos de respuestas del backend
```

---

## 🔐 Autenticación JWT

### 1. Cliente API Base (`lib/api-client.ts`)

```typescript
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Crear instancia de axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token JWT a todas las peticiones
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores y refrescar token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No hay refresh token, redirigir al login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Intentar refrescar el token
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // Guardar nuevo access token
        localStorage.setItem('access_token', data.accessToken);

        // Reintentar la petición original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh falló, cerrar sesión
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. Servicio de Autenticación (`lib/auth.ts`)

```typescript
import apiClient from './api-client';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const authService = {
  // Registro de usuario
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Guardar tokens
    localStorage.setItem('access_token', response.data.accessToken);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  },

  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    // Guardar tokens
    localStorage.setItem('access_token', response.data.accessToken);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
};
```

### 3. Hook de Autenticación (`hooks/useAuth.ts`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { authService, RegisterData, LoginData, AuthResponse } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay un token al cargar
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          // Obtener datos del usuario actual
          const response = await apiClient.get('/users/me');
          setUser(response.data);
        } catch (err) {
          console.error('Error al verificar autenticación:', err);
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al registrar usuario';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(data);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Credenciales inválidas';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
```

---

## 📡 Endpoints Disponibles

### Base URL

```
http://localhost:3000/api/v1
```

### 1. Autenticación (`/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar nuevo usuario | ❌ |
| POST | `/auth/login` | Iniciar sesión | ❌ |
| POST | `/auth/refresh` | Refrescar token JWT | ❌ |

### 2. Usuarios (`/users`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | Obtener perfil actual | ✅ |
| GET | `/users/:id` | Obtener usuario por ID | ✅ |
| PATCH | `/users/:id` | Actualizar usuario | ✅ |
| DELETE | `/users/:id` | Eliminar usuario | ✅ Admin |

### 3. Productos (`/products`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/products` | Crear producto | ✅ Admin |
| GET | `/products` | Listar productos (paginado) | ❌ |
| GET | `/products/:id` | Obtener producto por ID | ❌ |
| PATCH | `/products/:id` | Actualizar producto | ✅ Admin |
| DELETE | `/products/:id` | Eliminar producto | ✅ Admin |

### 4. Activos 3D (`/assets`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/assets/upload` | Subir archivo 3D (.glb, .usdz) | ✅ Admin |
| GET | `/assets/:id` | Obtener información del asset | ✅ |
| DELETE | `/assets/:id` | Eliminar asset | ✅ Admin |

---

## 💡 Ejemplos de Integración

### Página de Login (`app/login/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

### Listar Productos (`components/ProductList.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  createdAt: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products', {
          params: {
            page: 1,
            limit: 20,
          },
        });
        setProducts(response.data.items);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p className="price">S/ {product.price.toFixed(2)}</p>
          <p className="stock">Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

### Subir Modelo 3D (`components/UploadAsset.tsx`)

```typescript
'use client';

import { useState } from 'react';
import apiClient from '@/lib/api-client';

export default function UploadAsset({ productId }: { productId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);

    try {
      setUploading(true);
      setError(null);

      const response = await apiClient.post('/assets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Asset subido:', response.data);
      alert('Modelo 3D subido exitosamente');
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".glb,.usdz"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Subiendo...' : 'Subir Modelo 3D'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

---

## ⚠️ Manejo de Errores

### Estructura de Respuesta de Error

```typescript
interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  method: string;
}
```

### Ejemplo de Manejo

```typescript
import { AxiosError } from 'axios';

try {
  await apiClient.post('/products', productData);
} catch (error) {
  if (error instanceof AxiosError) {
    const errorResponse = error.response?.data as ErrorResponse;
    
    switch (error.response?.status) {
      case 400:
        console.error('Datos inválidos:', errorResponse.message);
        break;
      case 401:
        console.error('No autorizado - Token inválido');
        break;
      case 403:
        console.error('Acceso denegado - Permisos insuficientes');
        break;
      case 404:
        console.error('Recurso no encontrado');
        break;
      case 500:
        console.error('Error del servidor');
        break;
      default:
        console.error('Error desconocido:', errorResponse.message);
    }
  }
}
```

---

## 🔧 Variables de Entorno

### Backend (`.env`)

```bash
# Aplicación
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
CORS_ORIGINS=http://localhost:4200,http://localhost:3001

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Base de Datos
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_3d"
```

### Frontend Next.js (`.env.local`)

```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Otras configuraciones
NEXT_PUBLIC_APP_NAME=E-Commerce 3D
NEXT_PUBLIC_ENABLE_AR=true
```

---

## 📚 Recursos Adicionales

- **Documentación Swagger:** http://localhost:3000/api/v1/docs
- **Colección Postman:** Ver archivo `postman-collection.json`
- **Repositorio Backend:** [GitHub/GitLab URL]

---

## 🐛 Troubleshooting

### Error CORS

Si encuentras errores de CORS, verifica que tu dominio frontend esté en `CORS_ORIGINS`:

```bash
# Backend .env
CORS_ORIGINS=http://localhost:3001,http://localhost:4200
```

### Token Expirado

El token JWT expira después de 1 hora. El interceptor de axios automáticamente intenta refrescarlo usando el refresh token (válido por 7 días).

### 401 Unauthorized

Verifica que:
1. El token esté siendo enviado en el header `Authorization: Bearer <token>`
2. El token no haya expirado
3. El usuario tenga los permisos necesarios

---

**Última actualización:** Mayo 2026  
**Versión Backend:** 1.0.0  
**Stack:** NestJS + Prisma + PostgreSQL + Next.js
