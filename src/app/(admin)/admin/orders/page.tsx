import { OrderKanban } from '@/components/admin';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      <OrderKanban />
    </div>
  );
}
