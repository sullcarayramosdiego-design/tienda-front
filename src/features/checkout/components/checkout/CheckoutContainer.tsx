'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/features/auth';
import { useCartStore } from '@/features/checkout/stores/cart.store';
import { ordersService } from '@/features/checkout/services/orders.service';
import { subscriptionService } from '@/features/subscriptions';
import { loyaltyService } from '@/features/engagement';
import { PaymentTabs } from '@/features/checkout/components/payments/PaymentTabs';
import { ShippingSection } from '@/features/checkout/components/checkout/ShippingSection';
import { CheckoutOrderSummary } from '@/features/checkout/components/checkout/CheckoutOrderSummary';
import { LoyaltyRedemption } from '@/features/checkout/components/checkout/LoyaltyRedemption';
import { VipBenefitsCard } from '@/features/checkout/components/checkout/VipBenefitsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronRight,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import type { ShippingFormData } from '@/features/checkout/schemas/checkout.schema';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ['Envío', 'Pago'] as const;
type Step = (typeof STEPS)[number];

// ─── CheckoutContainer ────────────────────────────────────────────────────────

function CheckoutContainer() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [step, setStep] = useState<Step>('Envío');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Fidelización
  const [subscription, setSubscription] = useState<any | null>(null);
  const [loyaltyAccount, setLoyaltyAccount] = useState<any | null>(null);
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);
  const [pointsInput, setPointsInput] = useState<string>('');

  // Formulario de envío
  const [shippingForm, setShippingForm] = useState<ShippingFormData>({
    firstName: '', lastName: '', email: '', phone: '',
    department: '', province: '', district: '', address: '',
    reference: '', deliveryMethod: 'delivery',
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  // Cargar datos de fidelización al montar
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

  // ── Cálculo de totales ──────────────────────────────────────────────────────
  const subtotal = getTotalPrice();

  let isVipActive = false;
  let premiumDiscountPercentage = 0;
  let freeShippingApplied = false;

  if (subscription) {
    const now = new Date();
    const isValid =
      subscription.status === 'ACTIVE' ||
      (subscription.status === 'CANCELLED' && new Date(subscription.endDate) >= now);

    if (isValid && subscription.plan) {
      isVipActive = true;
      const features = subscription.plan.features as any;
      if (features?.premiumDiscounts === true) premiumDiscountPercentage = 0.10;
      if (features?.freeShipping === true || features?.arEnabled === true) freeShippingApplied = true;
    }
  }

  const premiumDiscount  = subtotal * premiumDiscountPercentage;
  const shipping         = freeShippingApplied ? 0 : subtotal >= 150 ? 0 : 12;
  const loyaltyDiscount  = redeemedPoints / 100;
  const totalDiscount    = premiumDiscount + loyaltyDiscount;
  const taxableSubtotal  = Math.max(0, subtotal - totalDiscount);
  const tax              = taxableSubtotal * 0.18;
  const grandTotal       = taxableSubtotal + tax + shipping;
  const pointsToEarn     = Math.floor(grandTotal * 10);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (key: keyof ShippingFormData, value: string) => {
    setShippingForm((p) => ({ ...p, [key]: value }));
    setShippingErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validateShipping = (): boolean => {
    const e: Partial<Record<keyof ShippingFormData, string>> = {};
    if (!shippingForm.firstName.trim())                               e.firstName = 'Requerido';
    if (!shippingForm.lastName.trim())                                e.lastName  = 'Requerido';
    if (!shippingForm.email.includes('@'))                            e.email     = 'Email inválido';
    if (shippingForm.phone.replace(/\D/g, '').length < 9)            e.phone     = 'Mínimo 9 dígitos';
    if (shippingForm.deliveryMethod === 'delivery') {
      if (!shippingForm.department)                                   e.department = 'Requerido';
      if (!shippingForm.province?.trim())                             e.province   = 'Requerido';
      if (!shippingForm.district?.trim())                             e.district   = 'Requerido';
      if (!shippingForm.address?.trim())                              e.address    = 'Requerido';
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
        customerName:  `${shippingForm.firstName} ${shippingForm.lastName}`,
        customerEmail: shippingForm.email,
        customerPhone: shippingForm.phone,
        redeemedPoints: redeemedPoints > 0 ? redeemedPoints : undefined,
      });
      clearCart();
      setOrderSuccess(true);
      setTimeout(() => router.push('/'), 3500);
    } catch (err: any) {
      setOrderError(
        err?.response?.data?.message || 'Error al procesar el pedido. Intenta nuevamente.',
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePointsChange = (input: string, redeemed: number) => {
    setPointsInput(input);
    setRedeemedPoints(redeemed);
  };

  // ── Empty cart ──────────────────────────────────────────────────────────────
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

  // ── Order success ───────────────────────────────────────────────────────────
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
          <h2 className="text-2xl font-heading font-extrabold text-foreground">¡Pedido confirmado!</h2>
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

      {/* Error banner */}
      {orderError && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-3.5">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive font-semibold flex-1">{orderError}</p>
          <button onClick={() => setOrderError(null)} className="text-destructive/60 hover:text-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT — main content */}
        <div className="lg:col-span-8 space-y-4">
          {step === 'Envío' ? (
            <>
              <ShippingSection form={shippingForm} errors={shippingErrors} onChange={handleChange} />

              {loyaltyAccount && loyaltyAccount.points >= 100 && (
                <LoyaltyRedemption
                  availablePoints={loyaltyAccount.points}
                  redeemedPoints={redeemedPoints}
                  pointsInput={pointsInput}
                  onPointsChange={handlePointsChange}
                />
              )}

              {isVipActive && (
                <VipBenefitsCard
                  premiumDiscountPercentage={premiumDiscountPercentage}
                  freeShippingApplied={freeShippingApplied}
                />
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
              {/* Back button */}
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
                      <PaymentTabs amount={grandTotal} onPaymentComplete={handlePaymentComplete} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* RIGHT — summary */}
        <div className="lg:col-span-4">
          <CheckoutOrderSummary
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

export default withAuth(CheckoutContainer);
export { CheckoutContainer };
