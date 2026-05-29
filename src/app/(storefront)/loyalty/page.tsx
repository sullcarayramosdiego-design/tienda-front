'use client';

import React from 'react';
import { LoyaltyDashboard } from '@/features/engagement';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function StandaloneLoyaltyPage() {
  return (
    <div className="w-full py-6">
      <div className="bg-card/40 border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md w-full">
          <LoyaltyDashboard />
      </div>
    </div>
  );
}
