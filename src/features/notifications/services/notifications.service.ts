import apiClient from '@/lib/api-client';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 
    | 'ORDER_CONFIRMED' 
    | 'ORDER_SHIPPED' 
    | 'ORDER_DELIVERED' 
    | 'PAYMENT_SUCCESS' 
    | 'PAYMENT_FAILED' 
    | 'POINTS_EARNED' 
    | 'SUBSCRIPTION_RENEWED' 
    | 'SUBSCRIPTION_EXPIRED' 
    | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export const notificationsService = {
  /**
   * GET /notifications — Obtener notificaciones del usuario autenticado
   */
  async getMyNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<{ success: boolean; data: { notifications: Notification[] } }>('/notifications');
    return response.data.data.notifications;
  },

  /**
   * PATCH /notifications/:id/read — Marcar notificación específica como leída
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.patch<{ success: boolean; data: Notification }>(`/notifications/${id}/read`);
    return response.data.data;
  },

  /**
   * PATCH /notifications/read-all — Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    const response = await apiClient.patch<{ success: boolean; data: { success: boolean; count: number } }>('/notifications/read-all');
    return response.data.data;
  },
};

export default notificationsService;
