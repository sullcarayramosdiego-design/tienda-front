import { Card } from '@/components/ui/card';
import { AssetUploadZone } from '@/features/inventory';

type Props = {
  params: Promise<{ productId: string }>;
};

// Next.js 16 con Cache Components exige retornar al menos un elemento para validación estática en build time
export async function generateStaticParams() {
  return [{ productId: 'default' }];
}

export default async function InventoryDetailPage({ params }: Props) {
  const { productId } = await params;
  if (productId === 'default') {
    return <div className="p-6">Inicializando Vista del Administrador...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Product #{productId}</h1>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">3D Model Upload</h2>
        <AssetUploadZone />
      </Card>
    </div>
  );
}
