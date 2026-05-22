import { InventoryTable } from '@/components/admin/InventoryTable';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <InventoryTable />
    </div>
  );
}
