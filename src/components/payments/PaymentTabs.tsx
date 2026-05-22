'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const paymentMethods = ['Credit Card', 'Yape', 'Plin', 'PagoEfectivo'];

export function PaymentTabs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {paymentMethods.map((method) => (
          <button
            key={method}
            className="block w-full text-left px-4 py-3 rounded border hover:bg-accent"
          >
            {method}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
