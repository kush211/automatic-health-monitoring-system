
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppointmentList } from '@/components/appointment-list';
import { doctors } from '@/lib/data';
import type { Appointment, User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { TransferAppointmentModal } from '@/components/transfer-appointment-modal';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useAppContext } from '@/hooks/use-app-context';

export default function AppointmentsPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, role } = useAuth();
  const { appointments, transferAppointment, updateAppointmentStatus } = useAppContext();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(new Date('2024-07-28T00:00:00Z'));
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userAppointments = useMemo(() => {
    if (!user) return [];
    if (role === 'Doctor') {
        return appointments.filter((app) => app.doctorId === user.uid);
    }
    // Nurses and other roles might see all appointments for the clinic
    return appointments;
  }, [appointments, user, role]);

  const appointmentsForSelectedDate = useMemo(
    () =>
      userAppointments.filter((appointment) =>
        isSameDay(new Date(appointment.dateTime), date || new Date())
      ),
    [userAppointments, date]
  );

  const handleOpenTransferModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setSelectedAppointment(null);
    setIsTransferModalOpen(false);
  };

  const handleConfirmTransfer = (newDoctor: User) => {
    if (!selectedAppointment) return;

    transferAppointment(selectedAppointment.appointmentId, newDoctor);

    handleCloseTransferModal();

    toast({
      title: 'Appointment Transferred',
      description: `Appointment with ${selectedAppointment.patientName} has been transferred to ${newDoctor.name}.`,
    });
  };

  const handleMarkAsArrived = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, 'Arrived');
    const appointment = appointments.find(app => app.appointmentId === appointmentId);
    if (!appointment) return;
    toast({
        title: 'Patient Arrived',
        description: `${appointment.patientName} has been marked as arrived.`,
    });
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, 'Cancelled');
    const appointment = appointments.find(app => app.appointmentId === appointmentId);
     if (!appointment) return;
    toast({
      title: 'Appointment Cancelled',
      description: `Appointment with ${appointment.patientName} has been cancelled.`,
      variant: 'destructive',
    });
  };

  const formattedSelectedDate = useMemo(() => {
    if (!mounted) return null;
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return (date || new Date()).toLocaleDateString('en-US', options);
  }, [mounted, date]);

  const descriptionText = useMemo(() => {
    if (appointmentsForSelectedDate.length > 0) {
      return `You have ${appointmentsForSelectedDate.length} appointment(s) scheduled.`;
    }
    return 'You have no appointments scheduled for this day.';
  }, [appointmentsForSelectedDate.length]);

  return (
    <>
      <div className="flex flex-col gap-8 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">Manage your patient appointments and schedule.</p>
          </div>
          {role === 'Doctor' && (
            <Button onClick={() => router.push('/book-appointment')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 flex-1 min-h-0">
          <Card className="md:col-span-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select a Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex justify-center items-start pt-0">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 flex flex-col min-h-0">
            <CardHeader>
              <CardTitle>
                Schedule for {formattedSelectedDate ?? 'Today'}
              </CardTitle>
              <CardDescription>{descriptionText}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-0 sm:p-6 sm:pt-0">
              <ScrollArea className="h-full">
                <AppointmentList
                  appointments={appointmentsForSelectedDate}
                  onTransfer={handleOpenTransferModal}
                  onMarkAsArrived={handleMarkAsArrived}
                  onCancel={handleCancelAppointment}
                  showTimes={mounted}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedAppointment && user && role === 'Doctor' && (
        <TransferAppointmentModal
          isOpen={isTransferModalOpen}
          onClose={handleCloseTransferModal}
          onConfirmTransfer={handleConfirmTransfer}
          appointment={selectedAppointment}
          doctors={doctors.filter((d) => d.uid !== user.uid)}
        />
      )}
    </>
  );
}
