import { InventoryTable } from '@/components/admin';

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-6 px-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Inventario
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestión centralizada de stock, variantes y recursos 3D.
        </p>
      </div>
      <InventoryTable />
    </div>
  );
}
