'use client';
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

const kpiData = [
  {
    title: 'Total Appointments',
    value: '0',
    description: 'Total appointments for today',
    icon: <Calendar />,
    change: '',
  },
  {
    title: 'Patients Arrived',
    value: '0',
    description: 'Patients checked-in today',
    icon: <LogIn />,
    change: '',
  },
  {
    title: 'Consultations Completed',
    value: '0',
    description: 'Finished consultations',
    icon: <CheckCircle2 />,
    change: '',
  },
  {
    title: 'Upcoming',
    value: '0',
    description: 'Patients yet to arrive',
    icon: <Users />,
    change: '',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  
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
                <Input placeholder="Search patient..." className="flex-1" />
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Doctors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Doctors</SelectItem>
                      <SelectItem value="dr-sharma">Dr. Priya Sharma</SelectItem>
                      <SelectItem value="dr-reddy">Dr. Vikram Reddy</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
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
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No appointments found for the selected filters.
                      </TableCell>
                    </TableRow>
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
                Current patient queue and estimated wait times for each doctor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/doc1/100/100" alt="Dr. Priya Sharma" />
                            <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className='font-semibold'>Dr. Priya Sharma</p>
                            <p className='text-sm text-muted-foreground'>Cardiology</p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className='font-bold text-lg'>5</p>
                        <p className='text-xs text-muted-foreground'>in queue</p>
                    </div>
                </div>
                 <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/doc2/100/100" alt="Dr. Vikram Reddy" />
                            <AvatarFallback>VR</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className='font-semibold'>Dr. Vikram Reddy</p>
                            <p className='text-sm text-muted-foreground'>Neurology</p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className='font-bold text-lg'>3</p>
                        <p className='text-xs text-muted-foreground'>in queue</p>
                    </div>
                </div>
                 <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/doc3/100/100" alt="Dr. Sunita Desai" />
                            <AvatarFallback>SD</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className='font-semibold'>Dr. Sunita Desai</p>
                            <p className='text-sm text-muted-foreground'>Pediatrics</p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className='font-bold text-lg'>8</p>
                        <p className='text-xs text-muted-foreground'>in queue</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}