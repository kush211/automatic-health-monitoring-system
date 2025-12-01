
'use client';
import { useMemo, useState, useEffect } from 'react';
import {
  Calendar,
  LogIn,
  CheckCircle2,
  Users,
  Search,
  PlusCircle,
  Book,
  UserCheck,
  Printer,
  ListFilter,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KpiCard } from '@/components/kpi-card';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppContext } from '@/hooks/use-app-context';
import { isSameDay, isBefore, getHours } from 'date-fns';
import { doctors } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns-tz';

export default function DashboardPage() {
  const { user } = useAuth();
  const { appointments } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all-day');

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = useMemo(() => new Date(), []);

  const todaysAppointments = useMemo(() => {
    return appointments.filter((app) => isSameDay(new Date(app.dateTime), today));
  }, [appointments, today]);

  const kpiData = useMemo(() => {
    const arrived = todaysAppointments.filter(app => app.status === 'Arrived').length;
    const completed = todaysAppointments.filter(app => app.status === 'Completed').length;
    const upcoming = todaysAppointments.filter(app => app.status === 'Scheduled').length;
    return [
        {
          title: 'Total Appointments',
          value: todaysAppointments.length.toString(),
          description: 'Total appointments for today',
          icon: <Calendar />,
          change: '',
        },
        {
          title: 'Patients Arrived',
          value: arrived.toString(),
          description: 'Patients checked-in today',
          icon: <LogIn />,
          change: '',
        },
        {
          title: 'Consultations Completed',
          value: completed.toString(),
          description: 'Finished consultations',
          icon: <CheckCircle2 />,
          change: '',
        },
        {
          title: 'Upcoming',
          value: upcoming.toString(),
          description: 'Patients yet to arrive',
          icon: <Users />,
          change: '',
        },
      ];
  }, [todaysAppointments]);

  const filteredAppointments = useMemo(() => {
    return todaysAppointments
      .filter(app => {
        const patientName = app.patientName.toLowerCase();
        const search = searchTerm.toLowerCase();
        return patientName.includes(search);
      })
      .filter(app => {
        if (doctorFilter === 'all') return true;
        return app.doctorId === doctorFilter;
      })
      .filter(app => {
        if (timeFilter === 'all-day') return true;
        const hour = getHours(new Date(app.dateTime));
        if (timeFilter === 'morning') return hour < 12;
        if (timeFilter === 'afternoon') return hour >= 12;
        return true;
      })
      .sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [todaysAppointments, searchTerm, doctorFilter, timeFilter]);
  
  const doctorQueues = useMemo(() => {
    return doctors.map(doc => {
      const queue = todaysAppointments.filter(app => app.doctorId === doc.uid && (app.status === 'Scheduled' || app.status === 'Arrived'));
      return {
        ...doc,
        queueCount: queue.length
      }
    })
  }, [todaysAppointments]);

  const getStatusBadge = (status: 'Scheduled' | 'Arrived' | 'Completed' | 'Cancelled') => {
    switch (status) {
      case 'Scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'Arrived':
        return <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">Arrived</Badge>;
      case 'Completed':
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };


  if (!user) return null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Front Desk Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome, {user.name}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpiData.map((kpi) => (
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
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient by name, ID, phone..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button className="flex-1 sm:flex-initial">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Patient
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-initial">
                <Book className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-initial">
                <UserCheck className="mr-2 h-4 w-4" />
                Walk-in Check-in
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-initial">
                <Printer className="mr-2 h-4 w-4" />
                Print Token
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>
                Real-time status of all appointments scheduled for today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                 <div className="flex gap-2 w-full sm:w-auto ml-auto">
                  <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Doctors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Doctors</SelectItem>
                      {doctors.map(doc => (
                        <SelectItem key={doc.uid} value={doc.uid}>{doc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-day">All Day</SelectItem>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="hidden sm:inline-flex">
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.length > 0 ? (
                       filteredAppointments.map(app => (
                        <TableRow key={app.appointmentId}>
                            <TableCell>{mounted ? format(new Date(app.dateTime), 'h:mm a') : '--:-- --'}</TableCell>
                            <TableCell>
                                <div className='flex items-center gap-3'>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={app.patientAvatarUrl} alt={app.patientName} />
                                        <AvatarFallback>{app.patientName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{app.patientName}</span>
                                </div>
                            </TableCell>
                            <TableCell>{app.doctorName}</TableCell>
                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                        </TableRow>
                       ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No appointments found for the selected filters.
                        </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Live Doctor Queues</CardTitle>
              <CardDescription>
                Current patient queue for each doctor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {doctorQueues.map(doc => (
                    <div key={doc.uid} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className='flex items-center gap-3'>
                            <Avatar>
                                <AvatarImage src={doc.avatarUrl} alt={doc.name} />
                                <AvatarFallback>{doc.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='font-semibold'>{doc.name}</p>
                                <p className='text-sm text-muted-foreground'>{doc.role}</p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='font-bold text-lg'>{doc.queueCount}</p>
                            <p className='text-xs text-muted-foreground'>in queue</p>
                        </div>
                    </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    