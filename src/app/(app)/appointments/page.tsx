
'use client';

import { useState } from 'react';
import { addDays, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppointmentList } from '@/components/appointment-list';
import { appointments as initialAppointments, doctors } from '@/lib/data';
import type { Appointment, User } from '@/lib/types';
import { demoUser } from '@/lib/data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { TransferAppointmentModal } from '@/components/transfer-appointment-modal';
import { useToast } from '@/hooks/use-toast';


export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date('2024-07-28T00:00:00Z'));
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const { toast } = useToast();

  const doctorAppointments = appointments.filter(
    (app) => app.doctorId === demoUser.uid
  );

  const appointmentsForSelectedDate = doctorAppointments.filter((appointment) =>
    isSameDay(new Date(appointment.dateTime), date || new Date())
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

    setAppointments(prev => 
      prev.filter(app => app.appointmentId !== selectedAppointment.appointmentId)
    );

    handleCloseTransferModal();

    toast({
      title: 'Appointment Transferred',
      description: `Appointment with ${selectedAppointment.patientName} has been transferred to ${newDoctor.name}.`,
    });
  }

  return (
    <>
      <div className="flex flex-col gap-8 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              Manage your patient appointments and schedule.
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
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
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 flex flex-col min-h-0">
            <CardHeader>
              <CardTitle>
                Schedule for {date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Today'}
              </CardTitle>
              <CardDescription>
                {appointmentsForSelectedDate.length > 0
                  ? `You have ${appointmentsForSelectedDate.length} appointment(s) scheduled.`
                  : 'You have no appointments scheduled for this day.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-0 sm:p-6 sm:pt-0">
              <ScrollArea className='h-full'>
                <AppointmentList 
                  appointments={appointmentsForSelectedDate}
                  onTransfer={handleOpenTransferModal}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      {selectedAppointment && (
        <TransferAppointmentModal
          isOpen={isTransferModalOpen}
          onClose={handleCloseTransferModal}
          onConfirmTransfer={handleConfirmTransfer}
          appointment={selectedAppointment}
          doctors={doctors.filter(d => d.uid !== demoUser.uid)}
        />
      )}
    </>
  );
}

    