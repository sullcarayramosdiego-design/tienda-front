import apiClient from '@/lib/api-client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  features: {
    priority3D: boolean;
    arEnabled: boolean;
    premiumDiscounts: boolean;
    [key: string]: boolean;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const subscriptionService = {
  /**
   * GET /subscriptions/plans - Obtener todos los planes disponibles
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<{ success: boolean; data: SubscriptionPlan[] }>('/subscriptions/plans');
    return response.data.data;
  },

  /**
   * GET /subscriptions/me - Obtener la suscripción actual del usuario
   */
  async getCurrentSubscription(): Promise<Subscription | null> {
    const response = await apiClient.get<{ success: boolean; data: Subscription | null }>('/subscriptions/me');
    return response.data.data;
  },

  /**
   * POST /subscriptions/subscribe - Suscribirse a un plan
   */
  async subscribe(planId: string): Promise<Subscription> {
    const response = await apiClient.post<{ success: boolean; data: Subscription }>('/subscriptions/subscribe', {
      planId,
    });
    return response.data.data;
  },

  /**
   * POST /subscriptions/cancel - Cancelar la renovación automática
   */
  async cancelSubscription(): Promise<Subscription> {
    const response = await apiClient.post<{ success: boolean; data: Subscription }>('/subscriptions/cancel');
    return response.data.data;
  },

  // ========================================================
  // ENDPOINTS ADMINISTRATIVOS (Solo ADMIN / SUPER_ADMIN)
  // ========================================================

  /**
   * GET /subscriptions/admin/subscribers - Listar todos los suscriptores registrados
   */
  async getSubscribersAdmin(page: number = 1, limit: number = 10): Promise<{
    subscriptions: Subscription[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        subscriptions: Subscription[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/subscriptions/admin/subscribers?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  /**
   * POST /subscriptions/admin/cancel/:id - Baja administrativa forzada de la suscripción de un usuario
   */
  async cancelSubscriptionAdmin(subscriptionId: string): Promise<Subscription> {
    const response = await apiClient.post<{ success: boolean; data: Subscription }>(`/subscriptions/admin/cancel/${subscriptionId}`);
    return response.data.data;
  },

  /**
   * POST /subscriptions/admin/plans - Crear un nuevo plan de suscripción
   */
  async createPlanAdmin(planData: any): Promise<SubscriptionPlan> {
    const response = await apiClient.post<{ success: boolean; data: SubscriptionPlan }>('/subscriptions/admin/plans', planData);
    return response.data.data;
  },

  /**
   * PATCH /subscriptions/admin/plans/:id - Actualizar un plan de suscripción
   */
  async updatePlanAdmin(planId: string, planData: any): Promise<SubscriptionPlan> {
    const response = await apiClient.patch<{ success: boolean; data: SubscriptionPlan }>(`/subscriptions/admin/plans/${planId}`, planData);
    return response.data.data;
  },

  /**
   * DELETE /subscriptions/admin/plans/:id - Desactivar/eliminar un plan
   */
  async deletePlanAdmin(planId: string): Promise<SubscriptionPlan> {
    const response = await apiClient.delete<{ success: boolean; data: SubscriptionPlan }>(`/subscriptions/admin/plans/${planId}`);
    return response.data.data;
  },
};

export default subscriptionService;
