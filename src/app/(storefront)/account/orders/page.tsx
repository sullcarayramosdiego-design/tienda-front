'use client';

import { Card } from '@/components/ui/card';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order History</h1>
      <Card className="p-6">
        <p className="text-muted-foreground text-center">No orders yet</p>
      </Card>
    </div>
  );
}
