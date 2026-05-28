'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/features/checkout/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { usePayments } from '@/features/checkout/hooks/usePayments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, CreditCard, Smartphone, Wallet, Truck } from 'lucide-react';
import type { CreateOrderDto, Address } from '@/types/order';
import type { PaymentMethod } from '@/types/payment';

type CheckoutStep = 'review' | 'payment' | 'processing' | 'success' | 'error';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface CheckoutFlowProps {
  shippingAddress?: Address;
  billingAddress?: Address;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
}

export function CheckoutFlow({
  shippingAddress,
  billingAddress,
  onSuccess,
  onError,
}: CheckoutFlowProps) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { createOrder, loading: orderLoading, error: orderError } = useOrders();
  const {
    payWithCulqi,
    payWithYape,
    payWithPlin,
    payOnDelivery,
    paymentIntent,
    loading: paymentLoading,
    error: paymentError,
  } = usePayments();

  const [step, setStep] = useState<CheckoutStep>('review');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calcular totales
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.18; // IGV 18%
  const shipping = subtotal > 100 ? 0 : 15; // Envío gratis >S/100
  const total = subtotal + tax + shipping;

  // Direcciones por defecto si no se proporcionan
  const defaultAddress: Address = {
    street: 'Av. Principal 123',
    city: 'Lima',
    postalCode: '15001',
    country: 'Perú',
  };

  const finalShippingAddress = shippingAddress || defaultAddress;
  const finalBillingAddress = billingAddress || shippingAddress || defaultAddress;

  /**
   * Paso 1: Crear orden
   */
  const handleCreateOrder = async () => {
    if (items.length === 0) {
      setErrorMessage('El carrito está vacío');
      return;
    }

    setStep('processing');
    setErrorMessage(null);

    try {
      const orderData: CreateOrderDto = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: finalShippingAddress,
        billingAddress: finalBillingAddress,
      };

      const order = await createOrder(orderData);
      setOrderId(order.id);
      setStep('payment');
    } catch (err) {
      const apiError = err as ApiError;
      const message = apiError.response?.data?.message || orderError || 'Error al crear la orden';
      setErrorMessage(message);
      setStep('error');
      onError?.(message);
    }
  };

  /**
   * Paso 2: Procesar pago
   */
  const handleProcessPayment = async () => {
    if (!orderId) {
      setErrorMessage('No se encontró ID de orden');
      return;
    }

    setStep('processing');
    setErrorMessage(null);

    try {
      let intent;

      switch (selectedPaymentMethod) {
        case 'CREDIT_CARD':
        case 'DEBIT_CARD':
          intent = await payWithCulqi(orderId, total, window.location.origin + '/checkout/success');
          break;
        case 'YAPE':
          intent = await payWithYape(orderId, total);
          break;
        case 'PLIN':
          intent = await payWithPlin(orderId, total);
          break;
        case 'CASH_ON_DELIVERY':
          intent = await payOnDelivery(orderId, total);
          break;
        default:
          throw new Error('Método de pago no soportado');
      }

      // Redirigir según el método de pago
      if (intent.checkoutUrl) {
        // Culqi u otro proveedor con checkout externo
        router.push(intent.checkoutUrl);
      } else if (selectedPaymentMethod === 'CASH_ON_DELIVERY') {
        // Pago contra entrega - orden confirmada directamente
        handlePaymentSuccess();
      } else {
        // Yape/Plin - mostrar QR o deeplink
        setStep('payment');
      }
    } catch (err) {
      const apiError = err as ApiError;
      const message = apiError.response?.data?.message || paymentError || 'Error al procesar el pago';
      setErrorMessage(message);
      setStep('error');
      onError?.(message);
    }
  };

  /**
   * Pago exitoso
   */
  const handlePaymentSuccess = () => {
    setStep('success');
    clearCart();
    onSuccess?.(orderId!);

    // Redirigir a página de confirmación después de 3 segundos
    setTimeout(() => {
      router.push(`/account/orders/${orderId}`);
    }, 3000);
  };

  /**
   * Renderizar método de pago
   */
  const renderPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return <CreditCard className="h-5 w-5" />;
      case 'YAPE':
      case 'PLIN':
        return <Smartphone className="h-5 w-5" />;
      case 'CASH_ON_DELIVERY':
        return <Truck className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  const paymentMethods: { method: PaymentMethod; label: string; description: string }[] = [
    { method: 'CREDIT_CARD', label: 'Tarjeta de Crédito/Débito', description: 'Paga con Culqi' },
    { method: 'YAPE', label: 'Yape', description: 'Pago instantáneo con QR' },
    { method: 'PLIN', label: 'Plin', description: 'Pago instantáneo con QR' },
    { method: 'CASH_ON_DELIVERY', label: 'Pago Contra Entrega', description: 'Paga al recibir' },
  ];

  return (
    <div className="space-y-6">
      {/* Paso 1: Revisión de orden */}
      {step === 'review' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resumen de tu pedido</CardTitle>
              <CardDescription>Revisa los productos antes de continuar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">S/ {(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IGV (18%)</span>
                  <span>S/ {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{shipping === 0 ? 'GRATIS' : `S/ ${shipping.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handleCreateOrder} disabled={orderLoading} className="w-full" size="lg">
                {orderLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Continuar al pago'
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Paso 2: Selección de método de pago */}
      {step === 'payment' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Método de pago</CardTitle>
              <CardDescription>Selecciona cómo deseas pagar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {paymentMethods.map(({ method, label, description }) => (
                  <button
                    key={method}
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
                      selectedPaymentMethod === method
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {renderPaymentMethodIcon(method)}
                    <div className="flex-1 text-left">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {selectedPaymentMethod === method && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* Mostrar QR si es Yape/Plin */}
              {paymentIntent?.qrCode && (selectedPaymentMethod === 'YAPE' || selectedPaymentMethod === 'PLIN') && (
                <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-muted/30">
                  <p className="font-medium">Escanea el código QR</p>
                  <Image src={paymentIntent.qrCode} alt="QR Code" width={256} height={256} className="w-64 h-64" />
                  {paymentIntent.deepLink && (
                    <Button variant="outline" asChild>
                      <a href={paymentIntent.deepLink} target="_blank" rel="noopener noreferrer">
                        Abrir en {selectedPaymentMethod}
                      </a>
                    </Button>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('review')}>
                  Volver
                </Button>
                <Button onClick={handleProcessPayment} disabled={paymentLoading} size="lg">
                  {paymentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar pago'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Paso 3: Procesando */}
      {step === 'processing' && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Procesando tu pedido...</p>
            <p className="text-sm text-muted-foreground">Por favor espera un momento</p>
          </CardContent>
        </Card>
      )}

      {/* Paso 4: Éxito */}
      {step === 'success' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold text-green-900">¡Pedido confirmado!</p>
              <p className="text-muted-foreground">
                Tu pedido <Badge variant="secondary">#{orderId?.slice(0, 8)}</Badge> ha sido procesado
                correctamente
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Redirigiendo a tus pedidos...</p>
          </CardContent>
        </Card>
      )}

      {/* Paso 5: Error */}
      {step === 'error' && errorMessage && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-8 space-y-4">
            <div className="flex items-start gap-4">
              <XCircle className="h-6 w-6 text-red-600 mt-1" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-red-900">Error al procesar tu pedido</p>
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/cart')}>
                Volver al carrito
              </Button>
              <Button onClick={() => setStep('review')}>Reintentar</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
