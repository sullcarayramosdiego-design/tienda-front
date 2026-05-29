'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoyaltyRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/loyalty');
  }, [router]);
  return null;
}
