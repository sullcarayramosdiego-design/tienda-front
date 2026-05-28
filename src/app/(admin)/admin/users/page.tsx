'use client';

import React from 'react';
import { Users as UsersIcon } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth';
import { UserTable } from '@/features/admin';

export default function UsersManagementPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6 w-full p-4">
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              <UsersIcon className="h-8 w-8 text-primary" />
              Gestión de Cuentas
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Administra los roles de usuario, activa o suspende perfiles de forma segura.
            </p>
          </div>
        </div>

        {/* Tabla de Gestión y Tarjetas de Estado de Cuentas */}
        <div className="border-t border-primary/5 pt-4">
          <UserTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}
