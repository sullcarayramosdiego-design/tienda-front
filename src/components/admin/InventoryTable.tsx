'use client';

import { Table } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

export function InventoryTable() {
  return (
    <Card className="p-6">
      <p className="text-muted-foreground">No products in inventory</p>
    </Card>
  );
}
