
'use client';
import { kpiData } from '@/lib/data';
import { Bed, Calendar, Stethoscope, Users, Database } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { MonthlyVisitsChart } from '@/components/monthly-visits-chart';
import { RecentActivity } from '@/components/recent-activity';
import { useAuth } from '@/hooks/use-auth';
import { useAppContext } from '@/hooks/use-app-context';
import { Button } from '@/components/ui/button';

export function DoctorDashboard() {
    const { user } = useAuth();
    const { DataSeeder, isSeeding, isSeedingComplete } = useAppContext();
    const dashboardKpis = [
        {
          title: 'Total Patients',
          value: kpiData.totalPatients.value,
          description: 'All patients in the system',
          icon: <Users />,
          change: kpiData.totalPatients.change,
        },
        {
          title: 'Visits this Month',
          value: kpiData.visitsThisMonth.value,
          description: 'Patient visits in the last 30 days',
          icon: <Calendar />,
          change: kpiData.visitsThisMonth.change,
        },
        {
          title: 'Bed Occupancy',
          value: kpiData.bedOccupancy.value,
          description: 'Currently occupied beds',
          icon: <Bed />,
          change: kpiData.bedOccupancy.change,
        },
        {
          title: 'Common Diagnosis',
          value: kpiData.commonDiagnosis.value,
          description: 'Most frequent diagnosis this month',
          icon: <Stethoscope />,
          change: kpiData.commonDiagnosis.change,
        },
      ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your clinic's activities.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Seed Database</CardTitle>
            <CardDescription>One-time action to populate the Firestore database with initial mock data.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={DataSeeder} disabled={isSeeding || isSeedingComplete}>
                <Database className="mr-2 h-4 w-4" />
                {isSeeding ? 'Seeding...' : isSeedingComplete ? 'Data Seeded' : 'Seed Database'}
            </Button>
            {isSeedingComplete && <p className='text-sm text-green-600 mt-2'>Database has been populated successfully. You can now remove the seeder button.</p>}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {dashboardKpis.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
            description={kpi.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Patient Visits</CardTitle>
              <CardDescription>
                A chart showing patient visits over the last year.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyVisitsChart />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
