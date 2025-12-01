
'use client';

import { useAuth } from '@/hooks/use-auth';
import { DoctorDashboard } from '@/components/doctor-dashboard';
import { NurseDashboard } from '@/components/nurse-dashboard';
import { ReceptionistDashboard } from '@/components/receptionist-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="flex flex-col gap-8">
             <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48 mt-2" />
            </div>
             <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Skeleton className="h-96" />
                </div>
                <div>
                    <Skeleton className="h-96" />
                </div>
            </div>
        </div>
    );
  }

  switch (role) {
    case 'Doctor':
      return <DoctorDashboard />;
    case 'Nurse':
      return <NurseDashboard />;
    case 'Receptionist':
      return <ReceptionistDashboard />;
    default:
      // Fallback or a generic dashboard for other roles
      return <div>Welcome! Your dashboard is under construction.</div>;
  }
}
