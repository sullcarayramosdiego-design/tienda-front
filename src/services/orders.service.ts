import apiClient from '@/lib/api-client';
import type { Order, CreateOrderDto, UpdateOrderStatusDto } from '@/types/order';

/**
 * Servicio para gestión de pedidos
 * Conecta con los endpoints de backend implementados en Fase 1
 */
export const ordersService = {
  /**
   * Obtener todos los pedidos del usuario autenticado
   * GET /api/v1/orders
   */
  async getMyOrders(): Promise<Order[]> {
    const response = await apiClient.get<{ success: boolean; data: Order[] }>('/v1/orders');
    return response.data.data;
  },

  /**
   * Obtener un pedido específico por ID
   * GET /api/v1/orders/:id
   */
  async getById(id: string): Promise<Order> {
    const response = await apiClient.get<{ success: boolean; data: Order }>(`/v1/orders/${id}`);
    return response.data.data;
  },

  /**
   * Crear un nuevo pedido desde el carrito
   * POST /api/v1/orders
   */
  async create(orderData: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post<{ success: boolean; data: Order }>('/v1/orders', orderData);
    return response.data.data;
  },

  /**
   * Actualizar estado de un pedido (solo admin)
   * PATCH /api/v1/orders/:id/status
   */
  async updateStatus(id: string, status: UpdateOrderStatusDto['status']): Promise<Order> {
    const response = await apiClient.patch<{ success: boolean; data: Order }>(
      `/v1/orders/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Cancelar un pedido
   * DELETE /api/v1/orders/:id
   */
  async cancel(id: string): Promise<Order> {
    const response = await apiClient.delete<{ success: boolean; data: Order }>(`/v1/orders/${id}`);
    return response.data.data;
  },
};

export default ordersService;
