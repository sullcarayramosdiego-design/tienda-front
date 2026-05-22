import { FinanceLedger } from '@/components/admin/FinanceLedger';

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Finance</h1>
      <FinanceLedger />
    </div>
  );
}
