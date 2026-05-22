'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoyaltyPointsBadge } from '@/components/storefront/LoyaltyPointsBadge';

export default function LoyaltyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Loyalty Program</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Points</CardTitle>
        </CardHeader>
        <CardContent>
          <LoyaltyPointsBadge />
        </CardContent>
      </Card>
    </div>
  );
}
