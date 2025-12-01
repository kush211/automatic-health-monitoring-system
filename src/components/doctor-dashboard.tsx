
'use client';
import { useMemo } from 'react';
import { Bed, Calendar, Stethoscope, Users } from 'lucide-react';
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
import { isThisMonth } from 'date-fns';

export function DoctorDashboard() {
    const { user } = useAuth();
    const { patients, appointments, beds } = useAppContext();

    const dashboardKpis = useMemo(() => {
        const totalPatients = patients.length;
        const visitsThisMonth = appointments.filter(app => isThisMonth(new Date(app.dateTime))).length;
        const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
        const totalBeds = beds.length;
        const bedOccupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

        return [
            {
              title: 'Total Patients',
              value: totalPatients.toString(),
              description: 'All patients in the system',
              icon: <Users />,
              change: '+2 this month', // Mock change data
            },
            {
              title: 'Visits this Month',
              value: visitsThisMonth.toString(),
              description: 'Patient visits in the last 30 days',
              icon: <Calendar />,
              change: '-5 from last month', // Mock change data
            },
            {
              title: 'Bed Occupancy',
              value: `${bedOccupancy}%`,
              description: 'Currently occupied beds',
              icon: <Bed />,
              change: '+3% from last week', // Mock change data
            },
            {
              title: 'Common Diagnosis',
              value: "Hypertension", // This remains mock data for now
              description: 'Most frequent diagnosis this month',
              icon: <Stethoscope />,
              change: "",
            },
          ];
    }, [patients, appointments, beds]);

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
