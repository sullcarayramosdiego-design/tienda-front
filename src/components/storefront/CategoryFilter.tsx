'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Laptop, Shirt, Home, Trophy, Grid } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Todos', icon: Grid },
  { id: 'Tecnología', name: 'Tecnología', icon: Laptop },
  { id: 'Ropa', name: 'Ropa', icon: Shirt },
  { id: 'Hogar', name: 'Hogar', icon: Home },
  { id: 'Deportes', name: 'Deportes', icon: Trophy },
];

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const activeId = selectedCategory || 'all';

  return (
    <Card className="border-primary/10 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden">
      <CardHeader className="pb-3 border-b border-primary/5">
        <CardTitle className="text-sm font-heading font-bold uppercase tracking-wider text-muted-foreground">
          Categorías
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-1.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id === 'all' ? null : cat.id)}
              className={cn(
                "flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer active:scale-95 group",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              )}
            >
              <Icon className={cn(
                "h-4.5 w-4.5 transition-transform duration-300",
                isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-primary"
              )} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
