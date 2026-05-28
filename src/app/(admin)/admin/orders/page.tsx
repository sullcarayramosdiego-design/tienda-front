'use client';

import React from 'react';
import { ShoppingBag, TableProperties } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/features/auth';
import { OrderKanban } from '@/features/admin';

export default function OrdersPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6 w-full p-4">
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              Tablero de Pedidos (Kanban)
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Arrastra y suelta pedidos para actualizar su estado de despacho en tiempo real.
            </p>
          </div>
          <Link href="/admin/orders/list">
            <Button variant="secondary" size="sm" className="h-10 px-4 rounded-xl text-xs font-bold gap-1.5 cursor-pointer">
              <TableProperties className="h-4 w-4" />
              Ver como Tabla
            </Button>
          </Link>
        </div>

        {/* Tablero Kanban */}
        <div className="border-t border-primary/5 pt-4">
          <OrderKanban />
        </div>
      </div>
    </ProtectedRoute>
  );
}
