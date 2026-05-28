/**
 * @fileoverview Componente de Checkout - Flujo completo Cart → Order → Payment
 * 
 * Integra los endpoints implementados en:
 * - Fase 1: Orders Controller (backend)
 * - Fase 2: Payments Controller (backend)
 * - Fase 3: Servicios frontend (orders.service.ts, payments.service.ts)
 * 
 * Flujo:
 * 1. Usuario revisa items del carrito
 * 2. Ingresa dirección de envío y facturación
 * 3. Sistema crea orden en backend (POST /api/v1/orders)
 * 4. Usuario selecciona método de pago
 * 5. Sistema crea intención de pago (POST /api/v1/payments/intents)
 * 6. Usuario completa pago (redirige a Culqi/Yape/Plin)
 * 7. Webhook actualiza estado de orden automáticamente
 */

'use client';

import { useState } from 'react';
import { useCart } from '@/features/checkout';
import { useOrders } from '@/features/checkout';
import { usePayments } from '@/features/checkout';
import type { Address, CreateOrderDto } from '@/features/checkout';
import type { PaymentMethod } from '@/features/checkout';

interface CheckoutStep {
  id: number;
  name: string;
  status: 'pending' | 'current' | 'complete';
}

export function CheckoutFlow() {
  const { items, totalPrice, clearCart } = useCart();
  const { createOrder, currentOrder, loading: orderLoading, error: orderError } = useOrders();
  const { createIntent, paymentIntent, loading: paymentLoading, error: paymentError } = usePayments();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    postalCode: '',
    country: 'Perú',
  });
  const [billingAddress, setBillingAddress] = useState<Address>({
    street: '',
    city: '',
    postalCode: '',
    country: 'Perú',
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const steps: CheckoutStep[] = [
    { id: 1, name: 'Carrito', status: currentStep > 1 ? 'complete' : 'current' },
    { id: 2, name: 'Dirección', status: currentStep === 2 ? 'current' : currentStep > 2 ? 'complete' : 'pending' },
    { id: 3, name: 'Pago', status: currentStep === 3 ? 'current' : currentStep > 3 ? 'complete' : 'pending' },
    { id: 4, name: 'Confirmación', status: currentStep === 4 ? 'current' : 'pending' },
  ];

  /**
   * Paso 1 → Paso 2: Validar que haya items en el carrito
   */
  const handleContinueToAddress = () => {
    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    setCurrentStep(2);
  };

  /**
   * Paso 2 → Paso 3: Crear orden en backend
   */
  const handleCreateOrder = async () => {
    try {
      const orderData: CreateOrderDto = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      };

      const order = await createOrder(orderData);
      console.log('✅ Orden creada:', order);
      setCurrentStep(3);
    } catch (error) {
      console.error('❌ Error al crear orden:', error);
      alert(orderError || 'Error al crear orden');
    }
  };

  /**
   * Paso 3 → Paso 4: Crear intención de pago y procesar
   */
  const handleProcessPayment = async () => {
    if (!currentOrder || !selectedPaymentMethod) {
      alert('Selecciona un método de pago');
      return;
    }

    try {
      const intent = await createIntent({
        orderId: currentOrder.id,
        paymentMethod: selectedPaymentMethod,
        amount: currentOrder.total,
        currency: 'PEN',
        returnUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
      });

      console.log('✅ Intención de pago creada:', intent);

      // Según el método de pago, redirigir o mostrar QR
      if (intent.checkoutUrl) {
        // Culqi: redirigir a checkout
        window.location.href = intent.checkoutUrl;
      } else if (intent.qrCode) {
        // Yape/Plin: mostrar QR
        setCurrentStep(4);
      } else {
        // Pago contra entrega
        clearCart();
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      alert(paymentError || 'Error al procesar pago');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Indicador de pasos */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center justify-between">
          {steps.map((step) => (
            <li key={step.id} className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${
                    step.status === 'complete'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : step.status === 'current'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-gray-300 text-gray-400'
                  }
                `}
              >
                {step.status === 'complete' ? '✓' : step.id}
              </div>
              <span className="ml-2 text-sm font-medium">{step.name}</span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Paso 1: Carrito */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Tu Carrito</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío</p>
          ) : (
            <>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity} × S/ {item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold">S/ {(item.quantity * item.product.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-4">
                <span>Total:</span>
                <span>S/ {totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleContinueToAddress}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Continuar al envío
              </button>
            </>
          )}
        </div>
      )}

      {/* Paso 2: Dirección */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Dirección de Envío</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Dirección"
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              className="w-full p-3 border rounded"
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="w-full p-3 border rounded"
            />
            <input
              type="text"
              placeholder="Código Postal"
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
              className="w-full p-3 border rounded"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Dirección de facturación es la misma</span>
            </label>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
            >
              Volver
            </button>
            <button
              onClick={handleCreateOrder}
              disabled={orderLoading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {orderLoading ? 'Procesando...' : 'Continuar al pago'}
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Método de Pago */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Método de Pago</h2>
          {currentOrder && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Orden ID: {currentOrder.id}</p>
              <p className="text-2xl font-bold">Total: S/ {currentOrder.total.toFixed(2)}</p>
            </div>
          )}
          <div className="space-y-3">
            {(['CREDIT_CARD', 'YAPE', 'PLIN', 'CASH_ON_DELIVERY'] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setSelectedPaymentMethod(method)}
                className={`w-full p-4 border-2 rounded-lg text-left ${
                  selectedPaymentMethod === method
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-medium">
                  {method === 'CREDIT_CARD'
                    ? '💳 Tarjeta de Crédito/Débito (Culqi)'
                    : method === 'YAPE'
                      ? '📱 Yape'
                      : method === 'PLIN'
                        ? '📱 Plin'
                        : '💵 Pago contra entrega'}
                </p>
              </button>
            ))}
          </div>
          <button
            onClick={handleProcessPayment}
            disabled={!selectedPaymentMethod || paymentLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {paymentLoading ? 'Procesando...' : 'Procesar Pago'}
          </button>
        </div>
      )}

      {/* Paso 4: Confirmación */}
      {currentStep === 4 && (
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-3xl font-bold">¡Orden Confirmada!</h2>
          {currentOrder && <p className="text-gray-600">Número de orden: {currentOrder.id}</p>}
          {paymentIntent?.qrCode && (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-lg font-medium">Escanea el código QR para completar el pago:</p>
              <img src={paymentIntent.qrCode} alt="QR de pago" className="w-64 h-64 border rounded" />
              <p className="text-sm text-gray-500">{paymentIntent.instructions}</p>
            </div>
          )}
          <button
            onClick={() => (window.location.href = '/orders')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Ver mis órdenes
          </button>
        </div>
      )}
    </div>
  );
}
