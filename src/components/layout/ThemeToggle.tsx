'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '@/providers';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-xl border border-primary/5 bg-card/25 text-foreground hover:bg-muted/50 cursor-pointer relative focus-visible:ring-0"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
          <span className="sr-only">Cambiar Tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-primary/5 min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => setTheme('light')} 
          className="text-xs font-semibold gap-2 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            Claro
          </div>
          {theme === 'light' && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')} 
          className="text-xs font-semibold gap-2 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-3.5 w-3.5 text-indigo-400" />
            Oscuro
          </div>
          {theme === 'dark' && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')} 
          className="text-xs font-semibold gap-2 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Laptop className="h-3.5 w-3.5 text-teal-400" />
            Sistema
          </div>
          {theme === 'system' && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
