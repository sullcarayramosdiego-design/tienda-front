'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { OrderTable } from '@/components/admin';

export default function OrdersListPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6 w-full p-4">
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              Directorio de Pedidos
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Listado tabular completo de todas las órdenes de compra emitidas en la plataforma.
            </p>
          </div>
        </div>

        {/* Tabla de Pedidos */}
        <div className="border-t border-primary/5 pt-4">
          <OrderTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}
