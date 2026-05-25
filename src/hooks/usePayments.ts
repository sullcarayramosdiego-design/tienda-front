'use client';

import { useState, useCallback } from 'react';
import { paymentsService } from '@/services/payments.service';
import type { Payment, CreatePaymentIntentDto, PaymentIntentResponse } from '@/types/payment';

/**
 * Hook para gestionar pagos
 * Conecta con el backend implementado en Fase 2
 */
export function usePayments() {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crear intención de pago
   */
  const createIntent = useCallback(async (paymentData: CreatePaymentIntentDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentsService.createIntent(paymentData);
      setPaymentIntent(data);
      setPayment(data.payment);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al crear intención de pago';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener estado de pago
   */
  const fetchPayment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentsService.getById(id);
      setPayment(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al obtener pago';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Procesar con Culqi (tarjetas)
   */
  const payWithCulqi = useCallback(async (orderId: string, amount: number, returnUrl?: string) => {
    return createIntent({
      orderId,
      paymentMethod: 'CREDIT_CARD',
      amount,
      currency: 'PEN',
      returnUrl,
    });
  }, [createIntent]);

  /**
   * Procesar con Yape
   */
  const payWithYape = useCallback(async (orderId: string, amount: number) => {
    return createIntent({
      orderId,
      paymentMethod: 'YAPE',
      amount,
      currency: 'PEN',
    });
  }, [createIntent]);

  /**
   * Procesar con Plin
   */
  const payWithPlin = useCallback(async (orderId: string, amount: number) => {
    return createIntent({
      orderId,
      paymentMethod: 'PLIN',
      amount,
      currency: 'PEN',
    });
  }, [createIntent]);

  /**
   * Seleccionar pago contra entrega
   */
  const payOnDelivery = useCallback(async (orderId: string, amount: number) => {
    return createIntent({
      orderId,
      paymentMethod: 'CASH_ON_DELIVERY',
      amount,
      currency: 'PEN',
    });
  }, [createIntent]);

  return {
    payment,
    paymentIntent,
    loading,
    error,
    createIntent,
    fetchPayment,
    payWithCulqi,
    payWithYape,
    payWithPlin,
    payOnDelivery,
  };
}
