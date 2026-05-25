'use client';

import { AdminSidebar, NotificationBell } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <div className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between bg-background/95 px-4 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <NotificationBell />
            </div>
          </div>
          <main className="flex-1 w-full overflow-y-auto p-6 pt-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
