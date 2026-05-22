'use client';

import { Card } from '@/components/ui/card';
import { use } from 'react';

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Order #{id}</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">Order details coming soon...</p>
      </Card>
    </div>
  );
}
