'use client';

import { Button } from '@/components/ui/button';

export function AdminHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <Button variant="outline">Logout</Button>
      </div>
    </header>
  );
}
