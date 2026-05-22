'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <Card className="p-6">
        <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/catalog">Continue Shopping</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
