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
};

export default subscriptionService;
