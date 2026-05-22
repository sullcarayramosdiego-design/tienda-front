import apiClient from '@/lib/api-client';
import type { Order } from '@/types/order';

/**
 * Servicio para gestión de pedidos
 */
export const ordersService = {
  /**
   * Obtener todos los pedidos del usuario autenticado
   */
  async getMyOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  },

  /**
   * Obtener un pedido específico por ID
   */
  async getById(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo pedido
   */
  async create(orderData: any): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', orderData);
    return response.data;
  },

  /**
   * Actualizar estado de un pedido (solo admin)
   */
  async updateStatus(id: string, status: string): Promise<Order> {
    const response = await apiClient.patch<Order>(`/orders/${id}`, { status });
    return response.data;
  },
};

export default ordersService;
