/**
 * Tipos de respuestas del backend API
 */

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  method: string;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenData {
  refreshToken: string;
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  assets?: Asset3D[];
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock?: number;
}

export interface ProductListResponse {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ============================================================================
// 3D Asset Types
// ============================================================================

export interface Asset3D {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  format: 'glb' | 'usdz';
  productId: string;
  createdAt: string;
}

export interface UploadAssetData {
  file: File;
  productId: string;
}

// ============================================================================
// Error Response Types
// ============================================================================

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  method: string;
}

// ============================================================================
// Success Response Types
// ============================================================================

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}
