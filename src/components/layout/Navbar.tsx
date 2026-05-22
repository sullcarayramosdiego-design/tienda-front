'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          E-Commerce
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/catalog">
            <Button variant="ghost">Catalog</Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost">Cart</Button>
          </Link>
          <Link href="/account">
            <Button variant="ghost">Account</Button>
          </Link>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
