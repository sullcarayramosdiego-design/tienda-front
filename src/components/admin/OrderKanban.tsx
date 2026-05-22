'use client';

import { Card } from '@/components/ui/card';

export function OrderKanban() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {['Pending', 'Processing', 'Completed'].map((status) => (
        <Card key={status} className="p-4">
          <h3 className="font-semibold mb-4">{status}</h3>
          <p className="text-sm text-muted-foreground">No orders</p>
        </Card>
      ))}
    </div>
  );
}
