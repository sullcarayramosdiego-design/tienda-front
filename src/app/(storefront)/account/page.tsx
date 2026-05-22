'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoyaltyPointsBadge } from '@/components/storefront/LoyaltyPointsBadge';
import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Account details coming soon...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent>
            <LoyaltyPointsBadge />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/account/orders" className="text-primary hover:underline">
              View order history
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
