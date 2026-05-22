'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">Order Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Thank you for your purchase.</p>
          <Button asChild className="w-full">
            <Link href="/catalog">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
