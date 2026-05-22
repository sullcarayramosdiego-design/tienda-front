'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Wishlist</h1>
      <Card className="p-6">
        <p className="text-muted-foreground text-center py-8">Your wishlist is empty</p>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/catalog">Browse Products</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
