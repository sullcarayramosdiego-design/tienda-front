import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Order #{id}</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">Order details coming soon...</p>
      </Card>
    </div>
  );
}
