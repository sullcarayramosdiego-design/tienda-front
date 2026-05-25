import apiClient from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';

export interface LowStockAlert {
  id: string;
  name: string;
  sku: string;
  stock: number;
  reserved: number;
  effectiveStock: number;
  isOutOfStock: boolean;
  category?: { name: string };
}

export interface InventoryMovement {
  id: string;
  productId: string;
  movementType: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'DAMAGE';
  quantity: number;
  reason?: string;
  performedBy?: string;
  createdAt: string;
}

export interface ProductMovementsResponse {
  movements: InventoryMovement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const inventoryService = {
  /**
   * POST /inventory/movements — Registrar movimiento manual de stock
   */
  async recordMovement(data: {
    productId: string;
    movementType: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'DAMAGE';
    quantity: number;
    reason?: string;
  }): Promise<{ movement: InventoryMovement; previousStock: number; newStock: number }> {
    const response = await apiClient.post<ApiResponse<{ movement: InventoryMovement; previousStock: number; newStock: number }>>(
      '/inventory/movements',
      data
    );
    return response.data.data;
  },

  /**
   * GET /inventory/alerts — Obtener lista de stock crítico bajo umbral
   */
  async getLowStockAlerts(threshold = 10): Promise<LowStockAlert[]> {
    const response = await apiClient.get<ApiResponse<LowStockAlert[]>>('/inventory/alerts', {
      params: { threshold },
    });
    return response.data.data;
  },

  /**
   * GET /inventory/:productId/movements — Obtener movimientos históricos del producto
   */
  async getProductMovements(
    productId: string,
    page = 1,
    limit = 20
  ): Promise<ProductMovementsResponse> {
    const response = await apiClient.get<ApiResponse<ProductMovementsResponse>>(
      `/inventory/${productId}/movements`,
      {
        params: { page, limit },
      }
    );
    return response.data.data;
  },
};

export default inventoryService;
