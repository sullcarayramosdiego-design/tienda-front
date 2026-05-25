/**
 * Ejemplo de uso del componente CheckoutFlow
 * 
 * Este archivo demuestra cómo integrar el flujo de checkout completo
 * en cualquier página de tu aplicación.
 */

'use client';

import { CheckoutFlow } from '@/components/storefront';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { Address } from '@/types/order';

export default function SimpleCheckoutExample() {
  const router = useRouter();

  // Direcciones de ejemplo - en producción estas vendrían del perfil del usuario
  const shippingAddress: Address = {
    street: 'Av. Javier Prado Este 1234',
    city: 'Lima',
    postalCode: '15036',
    country: 'Perú',
  };

  const billingAddress: Address = {
    street: 'Av. Javier Prado Este 1234',
    city: 'Lima',
    postalCode: '15036',
    country: 'Perú',
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-bold">Finalizar Compra</h1>
            <p className="text-muted-foreground">
              Completa tu pedido de manera segura y rápida
            </p>
          </div>

          {/* Checkout Flow Component */}
          <CheckoutFlow
            shippingAddress={shippingAddress}
            billingAddress={billingAddress}
            onSuccess={(orderId) => {
              console.log('✅ Pedido creado exitosamente:', orderId);
              // Aquí puedes agregar analytics, notificaciones, etc.
            }}
            onError={(error) => {
              console.error('❌ Error en checkout:', error);
              // Aquí puedes agregar logging de errores, etc.
            }}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
