
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, User, Stethoscope, Clock, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/hooks/use-app-context';
import { patients as allPatients, doctors } from '@/lib/data';
import type { Patient, User as UserType } from '@/lib/types';

export default function BookAppointmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addAppointment } = useAppContext();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<UserType | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const availableTimeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  ];

  const handleBookAppointment = async () => {
    if (!selectedPatient || !selectedDoctor || !date || !selectedTime) {
      toast({
        title: 'Missing Information',
        description: 'Please select a patient, doctor, date, and time.',
        variant: 'destructive',
      });
      return;
    }

    setIsBooking(true);
    
    // Combine date and time
    const [time, modifier] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    addAppointment({
        patient: selectedPatient,
        doctor: selectedDoctor,
        dateTime: appointmentDateTime.toISOString(),
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
        title: 'Appointment Booked',
        description: `Appointment for ${selectedPatient.name} with ${selectedDoctor.name} has been scheduled.`,
    });

    setIsBooking(false);
    router.push('/appointments');
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book New Appointment</h1>
        <p className="text-muted-foreground">Schedule a new consultation for a patient.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Patient Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><User className='h-5 w-5'/>Select Patient</CardTitle>
                    <CardDescription>Search for and select an existing patient.</CardDescription>
                </CardHeader>
                <CardContent>
                    {selectedPatient ? (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className='flex items-center gap-3'>
                                <Avatar>
                                    <AvatarImage src={selectedPatient.avatarUrl} alt={selectedPatient.name} />
                                    <AvatarFallback>{selectedPatient.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='font-semibold'>{selectedPatient.name}</p>
                                    <p className='text-sm text-muted-foreground'>{selectedPatient.patientId}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>Change</Button>
                        </div>
                    ) : (
                        <Command className="rounded-lg border shadow-md">
                            <CommandInput placeholder="Search for a patient..." />
                            <ScrollArea className="h-48">
                                <CommandList>
                                <CommandEmpty>No patients found.</CommandEmpty>
                                <CommandGroup>
                                    {allPatients.map((patient) => (
                                    <CommandItem key={patient.patientId} value={patient.name} onSelect={() => setSelectedPatient(patient)}>
                                        <Avatar className="mr-2 h-8 w-8">
                                        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{patient.name}</span>
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                            </ScrollArea>
                        </Command>
                    )}
                </CardContent>
            </Card>

             {/* Doctor Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Stethoscope className='h-5 w-5'/>Select Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                      {selectedDoctor ? (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className='flex items-center gap-3'>
                                <Avatar>
                                    <AvatarImage src={selectedDoctor.avatarUrl} alt={selectedDoctor.name} />
                                    <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='font-semibold'>{selectedDoctor.name}</p>
                                    <p className='text-sm text-muted-foreground'>{selectedDoctor.role}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDoctor(null)}>Change</Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-48">
                        <div className="space-y-4">
                        {doctors.map(doc => (
                            <div key={doc.uid} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer" onClick={() => setSelectedDoctor(doc)}>
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
                            </div>
                        ))}
                        </div>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Date and Time Selection */}
        <div className='space-y-8'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><CalendarIcon className='h-5 w-5'/>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border flex justify-center" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Clock className='h-5 w-5'/>Select Time Slot</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map(time => (
                        <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            onClick={() => setSelectedTime(time)}
                        >
                            {time}
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
       <div className='flex justify-end mt-4'>
            <Button size="lg" onClick={handleBookAppointment} disabled={isBooking}>
                <PlusCircle className='mr-2 h-4 w-4'/>
                {isBooking ? 'Booking Appointment...' : 'Book Appointment'}
            </Button>
       </div>
    </div>
  );
}
