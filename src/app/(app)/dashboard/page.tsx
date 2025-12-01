import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { KpiCard } from "@/components/kpi-card";
import { MonthlyVisitsChart } from "@/components/monthly-visits-chart";
import { RecentActivity } from "@/components/recent-activity";

import { kpiData } from "@/lib/data";

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, Dr. Priya Sharma!</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <KpiCard
          title="Total Patients"
          value={kpiData.totalPatients.value}
          change={kpiData.totalPatients.change}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Total number of registered patients."
        />
        <KpiCard
          title="Visits This Month"
          value={kpiData.visitsThisMonth.value}
          change={kpiData.visitsThisMonth.change}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          description="Patient visits in the current month."
        />
        <KpiCard
          title="Bed Occupancy"
          value={kpiData.bedOccupancy.value}
          change={kpiData.bedOccupancy.change}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          description="Current bed occupancy rate."
        />
        <KpiCard
          title="Common Diagnosis"
          value={kpiData.commonDiagnosis.value}
          change={kpiData.commonDiagnosis.change}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Most frequent diagnosis this month."
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Patient Visits</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <MonthlyVisitsChart />
          </CardContent>
        </Card>
        <RecentActivity />
      </div>
    </>
  );
}
