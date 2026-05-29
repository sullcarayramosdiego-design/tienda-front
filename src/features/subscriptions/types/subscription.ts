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
