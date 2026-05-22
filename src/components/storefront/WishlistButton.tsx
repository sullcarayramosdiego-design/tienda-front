'use client';

import { Button } from '@/components/ui/button';

interface WishlistButtonProps {
  productId: string;
}

export function WishlistButton({ productId }: WishlistButtonProps) {
  return (
    <Button variant="outline" size="icon">
      ♡
    </Button>
  );
}
