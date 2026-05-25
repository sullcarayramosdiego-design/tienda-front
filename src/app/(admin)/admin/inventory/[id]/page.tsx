'use client';

import { Card } from '@/components/ui/card';
import { AssetUploadZone } from '@/components/admin';
import { use } from 'react';

export default function InventoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Product #{id}</h1>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">3D Model Upload</h2>
        <AssetUploadZone />
      </Card>
    </div>
  );
}
