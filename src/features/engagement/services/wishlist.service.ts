import apiClient from '@/lib/api-client';
import type  { Product } from '@/features/inventory';

/**
   * Servicio para conectar con la API de favoritos del backend (Fase 3)
   */
export const wishlistService = {
  /**
   * GET /wishlist - Obtener favoritos del usuario autenticado
   */
  async getWishlist(): Promise<Product[]> {
    const response = await apiClient.get<{ success: boolean; data: Product[] }>('/wishlist');
    return response.data.data;
  },

  /**
   * POST /wishlist - Agregar un producto a favoritos
   */
  async addToWishlist(productId: string): Promise<Product> {
    const response = await apiClient.post<{ success: boolean; data: Product }>('/wishlist', {
      productId,
    });
    return response.data.data;
  },

  /**
   * DELETE /wishlist/:productId - Eliminar un producto de favoritos
   */
  async removeFromWishlist(productId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean; data: { success: boolean } }>(
      `/wishlist/${productId}`,
    );
    return response.data.data;
  },
};

export default wishlistService;
