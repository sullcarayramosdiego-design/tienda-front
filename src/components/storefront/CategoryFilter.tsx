'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const categories = ['Electronics', 'Clothing', 'Home', 'Sports'];

export function CategoryFilter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <button
            key={category}
            className="block w-full text-left px-3 py-2 rounded hover:bg-accent"
          >
            {category}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
