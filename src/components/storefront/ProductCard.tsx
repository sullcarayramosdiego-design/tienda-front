'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export function ProductCard({ id, name, price }: ProductCardProps) {
  return (
    <Link href={`/catalog/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-muted" />
        <CardContent className="p-4">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-lg font-bold">${price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
