import apiClient from '@/lib/api-client';
import type { Payment, CreatePaymentIntentDto, PaymentIntentResponse } from '@/types/payment';

/**
 * Servicio para gestión de pagos
 * Conecta con los endpoints de backend implementados en Fase 2
 */
export const paymentsService = {
  /**
   * Crear intención de pago
   * POST /api/v1/payments/intents
   */
  async createIntent(paymentData: CreatePaymentIntentDto): Promise<PaymentIntentResponse> {
    const response = await apiClient.post<{ success: boolean; data: PaymentIntentResponse }>(
      '/v1/payments/intents',
      paymentData
    );
    return response.data.data;
  },

  /**
   * Obtener estado de un pago
   * GET /api/v1/payments/:id
   */
  async getById(id: string): Promise<Payment> {
    const response = await apiClient.get<{ success: boolean; data: Payment }>(`/v1/payments/${id}`);
    return response.data.data;
  },

  /**
   * Procesar pago con Culqi (tarjetas)
   */
  async processWithCulqi(orderId: string, amount: number, returnUrl?: string): Promise<PaymentIntentResponse> {
    return this.createIntent({
      orderId,
      paymentMethod: 'CREDIT_CARD',
      amount,
      currency: 'PEN',
      returnUrl,
    });
  },

  /**
   * Procesar pago con Yape
   */
  async processWithYape(orderId: string, amount: number): Promise<PaymentIntentResponse> {
    return this.createIntent({
      orderId,
      paymentMethod: 'YAPE',
      amount,
      currency: 'PEN',
    });
  },

  /**
   * Procesar pago con Plin
   */
  async processWithPlin(orderId: string, amount: number): Promise<PaymentIntentResponse> {
    return this.createIntent({
      orderId,
      paymentMethod: 'PLIN',
      amount,
      currency: 'PEN',
    });
  },

  /**
   * Seleccionar pago contra entrega
   */
  async processCashOnDelivery(orderId: string, amount: number): Promise<PaymentIntentResponse> {
    return this.createIntent({
      orderId,
      paymentMethod: 'CASH_ON_DELIVERY',
      amount,
      currency: 'PEN',
    });
  },
};

export default paymentsService;
