
'use client';

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && role !== 'Admin' && pathname !== '/admin/login') {
        redirect('/admin/login');
    }
    if (!isLoading && role === 'Admin' && pathname === '/admin/login') {
        redirect('/admin/dashboard');
    }
  }, [isLoading, role, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-32 w-full" />
             <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </main>
      </div>
    );
  }
  
  // Allow login page to render without the full layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If not admin, we will be redirecting, so return null to avoid flashing content
  if (role !== 'Admin') {
    return null;
  }

  return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <div className="flex min-h-screen w-full flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
  );
}
