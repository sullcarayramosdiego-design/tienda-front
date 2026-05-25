export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'YAPE' | 'PLIN' | 'CASH_ON_DELIVERY';

export interface CreatePaymentIntentDto {
  orderId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  providerId?: string;
  providerData?: any;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  order?: {
    id: string;
    status: string;
    total: number;
  };
}

export interface PaymentIntentResponse {
  payment: Payment;
  provider?: string;
  publicKey?: string;
  checkoutUrl?: string;
  qrCode?: string;
  deepLink?: string;
  instructions?: string;
}
