'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PriceRangeSlider() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Range</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">$0 - $1000</p>
      </CardContent>
    </Card>
  );
}
