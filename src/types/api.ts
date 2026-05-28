/**
 * Tipos de respuestas del backend API generales
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
