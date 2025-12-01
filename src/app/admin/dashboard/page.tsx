
'use client';
import {
  BarChart,
  BookUser,
  Users,
  Bed,
  Briefcase,
  Monitor,
  Server,
  Activity,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { KpiCard } from '@/components/kpi-card';
import { useAuth } from '@/hooks/use-auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { allUsers } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const adminKpis = [
    {
      title: 'Total Users',
      value: allUsers.length.toString(),
      description: 'All registered staff members',
      icon: <Users />,
      change: '+2 this month',
    },
    {
      title: 'Active Appointments',
      value: '12',
      description: 'Appointments scheduled today',
      icon: <Activity />,
      change: '',
    },
    {
      title: 'Total Beds',
      value: '25',
      description: 'Total bed capacity across all wards',
      icon: <Bed />,
      change: '+5 since last week',
    },
    {
      title: 'System Health',
      value: 'Operational',
      description: 'All systems running smoothly',
      icon: <Server />,
      change: '',
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Administrator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome, {user?.name}. Here's an overview of the system.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {adminKpis.map((kpi) => (
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
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((u) => (
                <TableRow key={u.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={u.avatarUrl} alt={u.name} />
                        <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{u.role}</Badge>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="font-mono text-xs">{u.uid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
