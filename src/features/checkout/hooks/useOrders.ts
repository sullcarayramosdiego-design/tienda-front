'use client';

import { useState, useCallback } from 'react';
import { ordersService } from '../services/orders.service';
import type { Order, CreateOrderDto } from '../types/order';

/**
 * Hook para gestionar órdenes
 * Conecta con el backend implementado en Fase 1
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener todas las órdenes del usuario
   */
  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.getMyOrders();
      setOrders(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al obtener órdenes';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener orden por ID
   */
  const fetchOrderById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.getById(id);
      setCurrentOrder(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al obtener orden';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nueva orden desde el carrito
   */
  const createOrder = useCallback(async (orderData: CreateOrderDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.create(orderData);
      setCurrentOrder(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al crear orden';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancelar orden
   */
  const cancelOrder = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.cancel(id);
      setCurrentOrder(data);
      setOrders((prev) => prev.map((order) => (order.id === id ? data : order)));
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al cancelar orden';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Descargar boleta en formato PDF
   */
  const downloadOrderReceipt = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await ordersService.downloadReceipt(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `boleta-${id.slice(-8).toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      const message = 'Error al descargar la boleta de pago';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    currentOrder,
    loading,
    error,
    fetchMyOrders,
    fetchOrderById,
    createOrder,
    cancelOrder,
    downloadOrderReceipt,
  };
}
