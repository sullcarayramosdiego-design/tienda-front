import apiClient from '@/lib/api-client';
import type { Order, CreateOrderDto, UpdateOrderStatusDto } from '@/features/checkout/types/order';

/**
 * Servicio para gestión de pedidos
 * Conecta con los endpoints de backend implementados en Fase 1
 */
export const ordersService = {
  /**
   * Obtener todos los pedidos del usuario autenticado
   * GET /orders
   */
  async getMyOrders(): Promise<Order[]> {
    const response = await apiClient.get<{ success: boolean; data: Order[] }>('/orders');
    return response.data.data;
  },

  /**
   * Obtener todos los pedidos (solo admins)
   * GET /orders/all
   */
  async getAllAdmin(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const response = await apiClient.get<{
      success: boolean;
      data: {
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/orders/all?${queryParams.toString()}`);
    return response.data.data;
  },

  /**
   * Obtener un pedido específico por ID
   * GET /orders/:id
   */
  async getById(id: string): Promise<Order> {
    const response = await apiClient.get<{ success: boolean; data: Order }>(`/orders/${id}`);
    return response.data.data;
  },

  /**
   * Crear un nuevo pedido desde el carrito
   * POST /orders
   */
  async create(orderData: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post<{ success: boolean; data: Order }>('/orders', orderData);
    return response.data.data;
  },

  /**
   * Actualizar estado de un pedido (solo admin)
   * PATCH /orders/:id/status
   */
  async updateStatus(id: string, status: UpdateOrderStatusDto['status']): Promise<Order> {
    const response = await apiClient.patch<{ success: boolean; data: Order }>(
      `/orders/${id}/status`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Cancelar un pedido
   * DELETE /orders/:id
   */
  async cancel(id: string): Promise<Order> {
    const response = await apiClient.delete<{ success: boolean; data: Order }>(`/orders/${id}`);
    return response.data.data;
  },
};

export default ordersService;
