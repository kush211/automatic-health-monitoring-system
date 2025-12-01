

'use client';

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { NurseSidebar } from "@/components/nurse-sidebar";
import { ReceptionistSidebar } from "@/components/receptionist-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminSidebar } from "@/components/admin-sidebar";

function DashboardSidebarSkeleton() {
  return (
    <div className="hidden md:block">
        <div className="h-svh w-[16rem] p-2">
            <div className="flex h-full w-full flex-col bg-muted rounded-lg p-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex-grow"></div>
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    </div>
  );
}

function MainContentSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading } = useAuth();
  
  const renderSidebar = () => {
    switch (role) {
        case 'Doctor':
            return <DashboardSidebar />;
        case 'Nurse':
            return <NurseSidebar />;
        case 'Receptionist':
            return <ReceptionistSidebar />;
        case 'Admin':
            return <AdminSidebar />;
        default:
            return null;
    }
  }

  return (
      <SidebarProvider>
        {isLoading ? <DashboardSidebarSkeleton /> : renderSidebar()}
        <SidebarInset>
          <div className="flex min-h-screen w-full flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-y-auto">
              {isLoading ? <MainContentSkeleton /> : children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
  );
}
