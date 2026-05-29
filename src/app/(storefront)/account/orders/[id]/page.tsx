'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectProps {
  params: Promise<{ id: string }>;
}

export default function AccountOrderDetailRedirect({ params }: RedirectProps) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      router.replace(`/orders/${id}`);
    }
  }, [id, router]);

  return null;
}
