import { Card } from '@/components/ui/card';

type Props = {
  params: Promise<{ orderId: string }>;
};

// Next.js 16 con Cache Components exige retornar al menos un elemento para validación estática en build time
export async function generateStaticParams() {
  return [{ orderId: 'default' }];
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  if (orderId === 'default') {
    return <div className="p-6">Inicializando Vista del Administrador...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Order #{orderId}</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">Order details coming soon...</p>
      </Card>
    </div>
  );
}
