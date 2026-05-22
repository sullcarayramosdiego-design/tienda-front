'use client';

import { PaymentTabs } from '@/components/payments/PaymentTabs';
import { Card } from '@/components/ui/card';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentTabs />
        </div>
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <p className="text-muted-foreground">No items in cart</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
