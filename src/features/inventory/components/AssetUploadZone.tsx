'use client';

import { Card } from '@/components/ui/card';

export function AssetUploadZone() {
  return (
    <Card className="border-2 border-dashed p-8 text-center">
      <p className="text-muted-foreground">Drop files here or click to upload</p>
      <p className="text-xs text-muted-foreground mt-2">
        Supported formats: GLB, GLTF
      </p>
    </Card>
  );
}
