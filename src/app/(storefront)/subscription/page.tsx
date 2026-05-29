'use client';

import React from 'react';
import { SubscriptionDashboard } from '@/features/subscriptions';

export default function StandaloneSubscriptionPage() {
  return (
    <div className="w-full py-6">
      <div className="bg-card/40 border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md w-full">
        <SubscriptionDashboard />
      </div>
    </div>
  );
}
