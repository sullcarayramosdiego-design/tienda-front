'use client';

import React from 'react';
import { ProtectedRoute } from '@/features/auth';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 pb-20 w-full">
        {/* Standalone Viewport */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-6">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
