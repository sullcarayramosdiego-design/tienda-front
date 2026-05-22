import apiClient from '@/lib/api-client';
import type { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductListResponse,
  ProductQueryParams,
  ApiResponse
} from '@/types/api';

/**
 * Servicio para gestión de productos
 */
export const productsService = {
  /**
   * Crear un nuevo producto (requiere rol ADMIN)
   */
  async create(data: CreateProductData): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  /**
   * Listar productos con paginación y filtros (endpoint público)
   */
  async list(params?: ProductQueryParams): Promise<ProductListResponse> {
    const response = await apiClient.get<ApiResponse<ProductListResponse>>('/products', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        search: params?.search,
        minPrice: params?.minPrice,
        maxPrice: params?.maxPrice,
      },
    });
    return response.data.data;
  },

  /**
   * Obtener un producto por ID (endpoint público)
   */
  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  /**
   * Actualizar un producto existente (requiere rol ADMIN)
   */
  async update(id: string, data: UpdateProductData): Promise<Product> {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  /**
   * Eliminar un producto (requiere rol ADMIN)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  /**
   * Buscar productos por nombre o descripción
   */
  async search(query: string, page = 1, limit = 20): Promise<ProductListResponse> {
    return this.list({ search: query, page, limit });
  },

  /**
   * Filtrar productos por rango de precio
   */
  async filterByPrice(
    minPrice: number, 
    maxPrice: number, 
    page = 1, 
    limit = 20
  ): Promise<ProductListResponse> {
    return this.list({ minPrice, maxPrice, page, limit });
  },
};

export default productsService;
