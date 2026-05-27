'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute, withAuth } from '@/components/auth/ProtectedRoute';
import { useCartStore } from '@/stores/cart.store';
import { ordersService } from '@/services/orders.service';
import { subscriptionService } from '@/services/subscription.service';
import { loyaltyService } from '@/services/loyalty.service';
import { PaymentTabs } from '@/components/payments/PaymentTabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Package,
  MapPin,
  Truck,
  Store,
  ChevronRight,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ShoppingBag,
  ArrowLeft,
  Award,
  Wallet,
  Minus,
  Plus,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  province: string;
  district: string;
  address: string;
  reference: string;
  deliveryMethod: 'delivery' | 'pickup';
}

const DEPARTMENTS = [
  'Lima', 'Arequipa', 'Cusco', 'Callao', 'La Libertad',
  'Piura', 'Lambayeque', 'Junín', 'Áncash', 'Loreto',
];

const STEPS = ['Envío', 'Pago'] as const;
type Step = (typeof STEPS)[number];

// ─────────────────────────────────────────────────────────
// Field component helper
// ─────────────────────────────────────────────────────────
function Field({
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

const inputCls = (hasError?: boolean) =>
  `w-full bg-background border rounded-xl px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/40 ${
    hasError
      ? 'border-destructive/50 focus:border-destructive'
      : 'border-primary/10 focus:border-primary/40 hover:border-primary/20'
  }`;

// ─────────────────────────────────────────────────────────
// Order Summary (right sticky panel)
// ─────────────────────────────────────────────────────────
function OrderSummary({
  items,
  subtotal,
  premiumDiscount,
  loyaltyDiscount,
  shipping,
  grandTotal,
  pointsToEarn,
}: {
  items: any[];
  subtotal: number;
  premiumDiscount: number;
  loyaltyDiscount: number;
  shipping: number;
  grandTotal: number;
  pointsToEarn: number;
}) {
  const fmt = (v: number) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(v);

  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden sticky top-20">
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-5 py-4 border-b border-primary/5 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <h2 className="font-heading font-bold text-sm text-foreground">
            Resumen del pedido
          </h2>
          <span className="ml-auto text-[10px] font-bold text-muted-foreground">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Items list */}
        <div className="divide-y divide-primary/5 max-h-52 overflow-y-auto">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10 flex items-center justify-center shrink-0">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate leading-snug">{product.name}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">
                  {quantity} × {fmt(product.price)}
                </p>
              </div>
              <p className="text-xs font-extrabold text-primary shrink-0">
                {fmt(product.price * quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 py-4 space-y-2.5 border-t border-primary/5">
          <div className="flex justify-between text-xs text-muted-foreground font-semibold">
            <span>Subtotal</span>
            <span className="text-foreground font-bold">{fmt(subtotal)}</span>
          </div>

          {/* Premium VIP Discount */}
          {premiumDiscount > 0 && (
            <div className="flex justify-between text-xs font-semibold text-primary animate-fade-in">
              <span className="flex items-center gap-1">🏆 Descuento Premium VIP (10%)</span>
              <span className="font-bold">-{fmt(premiumDiscount)}</span>
            </div>
          )}

          {/* Loyalty Discount */}
          {loyaltyDiscount > 0 && (
            <div className="flex justify-between text-xs font-semibold text-emerald-600 animate-fade-in">
              <span className="flex items-center gap-1">🎁 Descuento Club Puntos</span>
              <span className="font-bold">-{fmt(loyaltyDiscount)}</span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Truck className="h-3 w-3" /> Envío
              {shipping === 0 && (
                <span className="px-1.5 py-0.5 text-[8px] font-black bg-[#00D47C]/15 border border-[#00D47C]/20 text-[#00AF66] rounded uppercase">
                  Gratis
                </span>
              )}
            </span>
            <span className={shipping === 0 ? 'text-[#00AF66] font-bold' : 'text-foreground font-bold'}>
              {shipping === 0 ? 'Gratis' : fmt(shipping)}
            </span>
          </div>

          {shipping > 0 && (
            <p className="text-[10px] text-muted-foreground leading-snug">
              * Agrega{' '}
              <span className="font-bold text-primary">{fmt(150 - subtotal)}</span> más para{' '}
              <strong>Envío Gratis</strong>
            </p>
          )}
          <div className="h-px bg-primary/5 my-1" />
          <div className="flex items-end justify-between">
            <span className="text-sm font-heading font-bold text-foreground">Total</span>
            <span className="text-xl font-heading font-black text-primary">{fmt(grandTotal)}</span>
          </div>
        </div>

        {/* Club 3D Points */}
        <div className="mx-5 mb-4 flex items-center gap-3 p-3 rounded-xl border border-primary/15 bg-primary/5">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Award className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-primary tracking-wider block">
              Club Puntos Acumulables
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              Ganarás <strong className="text-foreground font-extrabold">+{pointsToEarn.toLocaleString('es-PE')} Pts</strong> con este pedido
            </span>
          </div>
        </div>

        {/* Payment badges */}
        <div className="px-5 pb-4 space-y-2">
          <span className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1">
            <Wallet className="h-3 w-3 text-primary" /> Métodos disponibles
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Yape', color: 'text-[#00AF66]' },
              { label: 'Plin', color: 'text-[#00A8A9]' },
              { label: 'Efectivo', color: 'text-[#E05300]' },
              { label: 'Tarjeta', color: 'text-primary' },
            ].map(({ label, color }) => (
              <div
                key={label}
                className={`px-1 py-1.5 text-center text-[8px] font-extrabold rounded-lg bg-card border border-primary/5 shadow-sm uppercase tracking-wider ${color}`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="px-5 pb-4 flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
          <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
          Transacciones seguras y encriptadas
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// Shipping form section
// ─────────────────────────────────────────────────────────
function ShippingSection({
  form,
  errors,
  onChange,
}: {
  form: ShippingForm;
  errors: Partial<Record<keyof ShippingForm, string>>;
  onChange: (k: keyof ShippingForm, v: string) => void;
}) {
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
              {([
                { value: 'delivery', icon: Truck, label: 'Delivery a domicilio', sub: '1–3 días hábiles' },
                { value: 'pickup', icon: Store, label: 'Recojo en tienda', sub: 'Disponible hoy' },
              ] as const).map(({ value, icon: Icon, label, sub }) => (
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
                    value={form.department}
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
                    value={form.province}
                    onChange={(e) => onChange('province', e.target.value)}
                    className={inputCls(!!errors.province)}
                  />
                </Field>
              </div>
              <Field label="Distrito" error={errors.district}>
                <input
                  type="text"
                  placeholder="Miraflores"
                  value={form.district}
                  onChange={(e) => onChange('district', e.target.value)}
                  className={inputCls(!!errors.district)}
                />
              </Field>
              <Field label="Dirección completa" error={errors.address}>
                <input
                  type="text"
                  placeholder="Av. Larco 123, Dpto 4B"
                  value={form.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  className={inputCls(!!errors.address)}
                />
              </Field>
              <Field label="Referencia (opcional)">
                <input
                  type="text"
                  placeholder="Frente al parque, edificio azul"
                  value={form.reference}
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

// ─────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────
function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [step, setStep] = useState<Step>('Envío');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // States de Fidelización
  const [subscription, setSubscription] = useState<any | null>(null);
  const [loyaltyAccount, setLoyaltyAccount] = useState<any | null>(null);
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);
  const [pointsInput, setPointsInput] = useState<string>('');

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: '', lastName: '', email: '', phone: '',
    department: '', province: '', district: '', address: '',
    reference: '', deliveryMethod: 'delivery',
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingForm, string>>>({});

  // Cargar datos de lealtad y suscripciones del backend
  useEffect(() => {
    async function loadFidelizacionData() {
      try {
        const [subData, loyaltyData] = await Promise.all([
          subscriptionService.getCurrentSubscription().catch(() => null),
          loyaltyService.getMyAccount().catch(() => null),
        ]);
        setSubscription(subData);
        setLoyaltyAccount(loyaltyData);
      } catch (err) {
        console.error('Error al cargar datos de fidelización:', err);
      }
    }
    loadFidelizacionData();
  }, []);

  const subtotal = getTotalPrice();

  // --- CÁLCULO DE TOTALES DE FIDELIZACIÓN ---
  let isVipActive = false;
  let premiumDiscountPercentage = 0;
  let freeShippingApplied = false;

  if (subscription) {
    const status = subscription.status;
    const now = new Date();
    const isValid = status === 'ACTIVE' || (status === 'CANCELLED' && new Date(subscription.endDate) >= now);
    
    if (isValid && subscription.plan) {
      isVipActive = true;
      const features = subscription.plan.features as any;
      if (features?.premiumDiscounts === true) {
        premiumDiscountPercentage = 0.10; // 10% descuento catálogo
      }
      if (features?.freeShipping === true || features?.arEnabled === true) {
        freeShippingApplied = true; // Silver y Gold tienen envío gratis
      }
    }
  }

  const premiumDiscount = subtotal * premiumDiscountPercentage;
  let shipping = freeShippingApplied ? 0 : (subtotal >= 150 ? 0 : 12);
  
  const loyaltyDiscount = redeemedPoints / 100;
  const totalDiscount = premiumDiscount + loyaltyDiscount;
  
  const taxableSubtotal = Math.max(0, subtotal - totalDiscount);
  const tax = taxableSubtotal * 0.18;
  const grandTotal = taxableSubtotal + tax + shipping;

  const pointsToEarn = Math.floor(grandTotal * 10);

  const handleChange = (key: keyof ShippingForm, value: string) => {
    setShippingForm((p) => ({ ...p, [key]: value }));
    setShippingErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validateShipping = (): boolean => {
    const e: Partial<Record<keyof ShippingForm, string>> = {};
    if (!shippingForm.firstName.trim()) e.firstName = 'Requerido';
    if (!shippingForm.lastName.trim()) e.lastName = 'Requerido';
    if (!shippingForm.email.includes('@')) e.email = 'Email inválido';
    if (shippingForm.phone.replace(/\D/g, '').length < 9) e.phone = 'Mínimo 9 dígitos';
    if (shippingForm.deliveryMethod === 'delivery') {
      if (!shippingForm.department) e.department = 'Requerido';
      if (!shippingForm.province.trim()) e.province = 'Requerido';
      if (!shippingForm.district.trim()) e.district = 'Requerido';
      if (!shippingForm.address.trim()) e.address = 'Requerido';
    }
    setShippingErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePaymentComplete = async (method: string) => {
    setIsPlacingOrder(true);
    setOrderError(null);
    try {
      await ordersService.create({
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
          price: product.price,
        })),
        total: grandTotal,
        shippingAddress:
          shippingForm.deliveryMethod === 'delivery'
            ? `${shippingForm.address}, ${shippingForm.district}, ${shippingForm.province}, ${shippingForm.department}`
            : 'Recojo en tienda',
        paymentMethod: method,
        customerName: `${shippingForm.firstName} ${shippingForm.lastName}`,
        customerEmail: shippingForm.email,
        customerPhone: shippingForm.phone,
        redeemedPoints: redeemedPoints > 0 ? redeemedPoints : undefined,
      });
      clearCart();
      setOrderSuccess(true);
      setTimeout(() => router.push('/'), 3500);
    } catch (err: any) {
      setOrderError(
        err?.response?.data?.message || 'Error al procesar el pedido. Intenta nuevamente.'
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ── Empty cart ──
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-5 p-4">
        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 max-w-xs">
          <h1 className="text-2xl font-heading font-extrabold text-foreground">
            Tu carrito está vacío
          </h1>
          <p className="text-sm text-muted-foreground">
            Agrega productos desde el catálogo para continuar.
          </p>
        </div>
        <Button
          onClick={() => router.push('/catalog')}
          className="bg-primary text-primary-foreground rounded-2xl h-11 px-7 font-bold shadow-md shadow-primary/15 cursor-pointer"
        >
          Explorar Catálogo 3D
        </Button>
      </div>
    );
  }

  // ── Success ──
  if (orderSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-ping" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-extrabold text-foreground">
            ¡Pedido confirmado!
          </h2>
          <p className="text-sm text-muted-foreground">
            Recibirás confirmación en{' '}
            <span className="text-primary font-bold">{shippingForm.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Redirigiendo...
        </div>
      </div>
    );
  }

  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="space-y-5 pb-12">
      {/* Page title */}
      <div className="space-y-0.5">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-foreground">
          Finalizar compra
        </h1>
        <p className="text-sm text-muted-foreground font-semibold">
          Total:{' '}
          <span className="text-primary font-black">
            {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(grandTotal)}
          </span>
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                i === stepIdx
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15'
                  : i < stepIdx
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < stepIdx ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-black leading-none border-current">
                  {i + 1}
                </span>
              )}
              {s}
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {orderError && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-3.5">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive font-semibold flex-1">{orderError}</p>
          <button onClick={() => setOrderError(null)} className="text-destructive/60 hover:text-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT — main content */}
        <div className="lg:col-span-8 space-y-4">
          {step === 'Envío' ? (
            <>
              <ShippingSection form={shippingForm} errors={shippingErrors} onChange={handleChange} />
              
              {/* Canjear Puntos Card */}
              {loyaltyAccount && loyaltyAccount.points >= 100 && (
                <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden mt-4">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Award className="h-5 w-5 animate-pulse" />
                      <h3 className="font-heading font-bold text-sm text-foreground">Canjear Puntos Club 3D</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tienes <strong className="text-foreground">{loyaltyAccount.points.toLocaleString('es-PE')} pts</strong>. 
                      Puedes canjearlos en múltiplos de 100 por un descuento directo de <strong className="text-emerald-600">S/. 1.00 por cada 100 pts</strong>.
                    </p>
                    
                    <div className="flex items-center gap-2 max-w-xs">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 cursor-pointer"
                        onClick={() => {
                          const newPts = Math.max(0, redeemedPoints - 100);
                          setRedeemedPoints(newPts);
                          setPointsInput(newPts > 0 ? String(newPts) : '');
                        }}
                        disabled={redeemedPoints <= 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min={100}
                        step={100}
                        max={Math.floor(loyaltyAccount.points / 100) * 100}
                        placeholder="Cantidad de puntos"
                        value={pointsInput}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setPointsInput(e.target.value);
                          if (val >= 0 && val <= loyaltyAccount.points) {
                            setRedeemedPoints(Math.floor(val / 100) * 100);
                          }
                        }}
                        className="text-center font-bold h-9"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 cursor-pointer"
                        onClick={() => {
                          const maxVal = Math.floor(loyaltyAccount.points / 100) * 100;
                          const newPts = Math.min(maxVal, redeemedPoints + 100);
                          setRedeemedPoints(newPts);
                          setPointsInput(String(newPts));
                        }}
                        disabled={redeemedPoints >= Math.floor(loyaltyAccount.points / 100) * 100}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    {redeemedPoints > 0 && (
                      <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-fade-in">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        ¡Descuento de S/. {loyaltyDiscount.toFixed(2)} aplicado exitosamente!
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* VIP Benefits Info Card */}
              {isVipActive && (
                <Card className="border-primary/15 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent shadow-lg overflow-hidden mt-4">
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-primary tracking-wider">Beneficios VIP Premium Activos</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        {premiumDiscountPercentage > 0 && '✓ Descuento premium del 10% en catálogo. '}
                        {freeShippingApplied && '✓ Envío prioritario totalmente gratuito.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={() => { if (validateShipping()) setStep('Pago'); }}
                className="w-full h-12 font-bold tracking-wide bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl shadow-lg shadow-primary/15 cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                Continuar al pago
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              {/* Back */}
              <button
                onClick={() => setStep('Envío')}
                className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Volver a datos de envío
              </button>

              {/* Payment card */}
              <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="px-5 py-4 border-b border-primary/5 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <h2 className="font-heading font-bold text-sm text-foreground">
                      Método de pago
                    </h2>
                  </div>

                  <div className="p-5">
                    {isPlacingOrder ? (
                      <div className="flex flex-col items-center gap-4 py-10">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <p className="text-xs font-semibold text-muted-foreground">
                          Confirmando tu pedido...
                        </p>
                      </div>
                    ) : (
                      <PaymentTabs
                        amount={grandTotal}
                        onPaymentComplete={handlePaymentComplete}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* RIGHT — summary */}
        <div className="lg:col-span-4">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            premiumDiscount={premiumDiscount}
            loyaltyDiscount={loyaltyDiscount}
            shipping={shipping}
            grandTotal={grandTotal}
            pointsToEarn={pointsToEarn}
          />
        </div>
      </div>
    </div>
  );
}

export default withAuth(CheckoutPage);
