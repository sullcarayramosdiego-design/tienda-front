import { MetricCard } from '@/components/admin';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Orders" value="0" />
        <MetricCard title="Revenue" value="$0" />
        <MetricCard title="Products" value="0" />
        <MetricCard title="Users" value="0" />
      </div>
    </div>
  );
}
