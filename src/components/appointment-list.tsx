
'use client';

import type { Appointment } from '@/lib/types';
import { format } from 'date-fns-tz';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Video, Check, X, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface AppointmentListProps {
  appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <p className="text-lg font-semibold text-muted-foreground">No Appointments</p>
        <p className="text-sm text-muted-foreground">There are no appointments scheduled for this day.</p>
      </div>
    );
  }

  const getStatusBadge = (status: Appointment['status']) => {
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

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {appointments
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
        .map((appointment) => (
        <Card key={appointment.appointmentId} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={appointment.patientAvatarUrl} alt={appointment.patientName} />
                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{appointment.patientName}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(appointment.dateTime), 'h:mm a', { timeZone: 'UTC' })}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
                {getStatusBadge(appointment.status)}
                {appointment.status === 'Scheduled' && (
                    <Button variant="outline" size="sm">
                        <Check className="mr-2 h-4 w-4 text-green-600" /> Mark as Arrived
                    </Button>
                )}
                 {appointment.status === 'Arrived' && (
                    <Button variant="default" size="sm" asChild>
                        <Link href={`/patients/${appointment.patientId.split('-')[1]}`}>
                            <Video className="mr-2 h-4 w-4" /> Start Consultation
                        </Link>
                    </Button>
                )}
                 {appointment.status === 'Completed' && (
                    <Button variant="ghost" size="sm" asChild>
                         <Link href={`/patients/${appointment.patientId.split('-')[1]}`}>
                            View Record
                        </Link>
                    </Button>
                )}
                 {appointment.status === 'Scheduled' && (
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                 )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

