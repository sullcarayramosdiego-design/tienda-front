'use client';

import React from 'react';
import { MapPin, Truck, Store, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DEPARTMENTS, type ShippingFormData } from '@/features/checkout/schemas/checkout.schema';

// ─── helpers ──────────────────────────────────────────────────────────────────

export function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[10px] text-destructive flex items-center gap-1 font-semibold">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export const inputCls = (hasError?: boolean) =>
  `w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/40 ${
    hasError
      ? 'border-destructive/50 focus:border-destructive'
      : 'border-primary/10 focus:border-primary/40 hover:border-primary/20'
  }`;

// ─── ShippingSection ───────────────────────────────────────────────────────────

interface ShippingSectionProps {
  form: ShippingFormData;
  errors: Partial<Record<keyof ShippingFormData, string>>;
  onChange: (k: keyof ShippingFormData, v: string) => void;
}

export function ShippingSection({ form, errors, onChange }: ShippingSectionProps) {
  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-5 py-4 border-b border-primary/5 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h2 className="font-heading font-bold text-sm text-foreground">Datos de envío</h2>
        </div>

        <div className="p-5 space-y-5">
          {/* Delivery method */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Método de entrega
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: 'delivery', icon: Truck,  label: 'Delivery a domicilio', sub: '1–3 días hábiles' },
                  { value: 'pickup',   icon: Store,   label: 'Recojo en tienda',     sub: 'Disponible hoy' },
                ] as const
              ).map(({ value, icon: Icon, label, sub }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange('deliveryMethod', value)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                    form.deliveryMethod === value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-primary/10 hover:border-primary/20 text-muted-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-extrabold leading-snug">{label}</p>
                    <p className="text-[9px] opacity-60 mt-0.5">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Personal info */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Información personal
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" error={errors.firstName}>
                <input
                  type="text"
                  placeholder="Juan"
                  value={form.firstName}
                  onChange={(e) => onChange('firstName', e.target.value)}
                  className={inputCls(!!errors.firstName)}
                />
              </Field>
              <Field label="Apellido" error={errors.lastName}>
                <input
                  type="text"
                  placeholder="García"
                  value={form.lastName}
                  onChange={(e) => onChange('lastName', e.target.value)}
                  className={inputCls(!!errors.lastName)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Correo electrónico" error={errors.email}>
                <input
                  type="email"
                  placeholder="juan@email.com"
                  value={form.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  className={inputCls(!!errors.email)}
                />
              </Field>
              <Field label="Teléfono / Celular" error={errors.phone}>
                <input
                  type="tel"
                  placeholder="987 654 321"
                  value={form.phone}
                  onChange={(e) => onChange('phone', e.target.value)}
                  className={inputCls(!!errors.phone)}
                />
              </Field>
            </div>
          </div>

          {/* Address — delivery only */}
          {form.deliveryMethod === 'delivery' && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Dirección de entrega
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Departamento" error={errors.department}>
                  <select
                    value={form.department ?? ''}
                    onChange={(e) => onChange('department', e.target.value)}
                    className={inputCls(!!errors.department) + ' cursor-pointer'}
                  >
                    <option value="">Seleccionar...</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Provincia" error={errors.province}>
                  <input
                    type="text"
                    placeholder="Lima"
                    value={form.province ?? ''}
                    onChange={(e) => onChange('province', e.target.value)}
                    className={inputCls(!!errors.province)}
                  />
                </Field>
              </div>
              <Field label="Distrito" error={errors.district}>
                <input
                  type="text"
                  placeholder="Miraflores"
                  value={form.district ?? ''}
                  onChange={(e) => onChange('district', e.target.value)}
                  className={inputCls(!!errors.district)}
                />
              </Field>
              <Field label="Dirección completa" error={errors.address}>
                <input
                  type="text"
                  placeholder="Av. Larco 123, Dpto 4B"
                  value={form.address ?? ''}
                  onChange={(e) => onChange('address', e.target.value)}
                  className={inputCls(!!errors.address)}
                />
              </Field>
              <Field label="Referencia (opcional)">
                <input
                  type="text"
                  placeholder="Frente al parque, edificio azul"
                  value={form.reference ?? ''}
                  onChange={(e) => onChange('reference', e.target.value)}
                  className={inputCls()}
                />
              </Field>
            </div>
          )}

          {/* Pickup info */}
          {form.deliveryMethod === 'pickup' && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/15 bg-primary/5">
              <Store className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-foreground">Tienda 3D — Lima Centro</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Av. Javier Prado Este 1234, San Isidro, Lima<br />
                  Lun–Sáb 9am–8pm · Dom 10am–6pm
                </p>
                <p className="text-[10px] text-primary font-bold">✓ Disponible para recojo hoy mismo</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
