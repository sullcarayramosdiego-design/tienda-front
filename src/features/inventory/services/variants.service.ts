import apiClient from '@/lib/api-client';
import type  { ApiResponse } from '@/types/api';
import type  { ProductVariant, CreateVariantData, UpdateVariantData } from '@/features/inventory';

/**
 * Servicio para gestión de variantes de producto (SKUs complejos).
 * Todos los endpoints requieren autenticación y rol ADMIN.
 * Base URL: /products/:productId/variants
 */
export const variantsService = {
  /**
   * Listar todas las variantes de un producto
   */
  async list(productId: string): Promise<ProductVariant[]> {
    const response = await apiClient.get<ApiResponse<ProductVariant[]>>(
      `/products/${productId}/variants`
    );
    return response.data.data;
  },

  /**
   * Obtener una variante específica por ID
   */
  async getById(productId: string, variantId: string): Promise<ProductVariant> {
    const response = await apiClient.get<ApiResponse<ProductVariant>>(
      `/products/${productId}/variants/${variantId}`
    );
    return response.data.data;
  },

  /**
   * Crear una nueva variante para un producto
   */
  async create(productId: string, data: CreateVariantData): Promise<ProductVariant> {
    const response = await apiClient.post<ApiResponse<ProductVariant>>(
      `/products/${productId}/variants`,
      data
    );
    return response.data.data;
  },

  /**
   * Actualizar parcialmente una variante existente
   */
  async update(
    productId: string,
    variantId: string,
    data: UpdateVariantData
  ): Promise<ProductVariant> {
    const response = await apiClient.patch<ApiResponse<ProductVariant>>(
      `/products/${productId}/variants/${variantId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Eliminar una variante de producto
   */
  async delete(productId: string, variantId: string): Promise<void> {
    await apiClient.delete(`/products/${productId}/variants/${variantId}`);
  },

  /**
   * Crear múltiples variantes en lote para un producto recién creado
   */
  async bulkCreate(
    productId: string,
    variants: CreateVariantData[]
  ): Promise<ProductVariant[]> {
    const results = await Promise.allSettled(
      variants.map((v) => this.create(productId, v))
    );

    const created: ProductVariant[] = [];
    const failed: number[] = [];

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        created.push(result.value);
      } else {
        failed.push(idx);
      }
    });

    if (failed.length > 0) {
      const error = new Error(
        `${failed.length} variante(s) no se pudieron crear. Verifique que los SKUs no estén duplicados.`
      ) as any;
      error.partialResults = created;
      error.failedIndexes = failed;
      throw error;
    }

    return created;
  },
};

export default variantsService;
