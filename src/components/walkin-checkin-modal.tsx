"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, Stethoscope } from "lucide-react";
import type { Patient, User } from "@/lib/types";
import { patients as allPatients, doctors } from "@/lib/data";
import { useAppContext } from "@/hooks/use-app-context";
import { useToast } from "@/hooks/use-toast";

interface WalkInCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalkInCheckInModal({
  isOpen,
  onClose,
}: WalkInCheckInModalProps) {
  const { addAppointment } = useAppContext();
  const { toast } = useToast();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const handleCheckIn = async () => Kuldeep;
    if (!selectedPatient || !selectedDoctor) {
        toast({
            title: "Missing Information",
            description: "Please select a patient and a doctor.",
            variant: "destructive",
        });
        return;
    }

    setIsCheckingIn(true);
    
    // For walk-ins, we add them to the queue for the current time
    const appointmentDateTime = new Date().toISOString();

    addAppointment({
        patient: selectedPatient,
        doctor: selectedDoctor,
        dateTime: appointmentDateTime,
        status: 'Arrived', // Walk-ins are immediately marked as arrived
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
        title: "Patient Checked In",
        description: `${selectedPatient.name} has been added to ${selectedDoctor.name}'s queue.`,
    });

    setIsCheckingIn(false);
    handleClose();
  };
  
  const handleClose = () => {
    setSelectedPatient(null);
    setSelectedDoctor(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-primary" />
            Walk-in Patient Check-in
          </DialogTitle>
          <DialogDescription>
            Quickly check-in a patient who has arrived without an appointment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 py-4">
            {/* Patient Selection */}
            <div>
                <h3 className="font-semibold mb-2">1. Select Patient</h3>
                {selectedPatient ? (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className='flex items-center gap-3'>
                            <Avatar>
                                <AvatarImage src={selectedPatient.avatarUrl} alt={selectedPatient.name} />
                                <AvatarFallback>{selectedPatient.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className='font-semibold'>{selectedPatient.name}</p>
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
            </div>
            {/* Doctor Selection */}
            <div>
                <h3 className="font-semibold mb-2">2. Assign to Doctor</h3>
                {selectedDoctor ? (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className='flex items-center gap-3'>
                            <Avatar>
                                <AvatarImage src={selectedDoctor.avatarUrl} alt={selectedDoctor.name} />
                                <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className='font-semibold'>{selectedDoctor.name}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDoctor(null)}>Change</Button>
                    </div>
                ) : (
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder="Search for a doctor..." />
                        <ScrollArea className="h-48">
                            <CommandList>
                            <CommandEmpty>No doctors found.</CommandEmpty>
                            <CommandGroup>
                                {doctors.map((doctor) => (
                                <CommandItem key={doctor.uid} value={doctor.name} onSelect={() => setSelectedDoctor(doctor)}>
                                    <Avatar className="mr-2 h-8 w-8">
                                    <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{doctor.name}</span>
                                </CommandItem>
                                ))}
                            </CommandGroup>
                            </CommandList>
                        </ScrollArea>
                    </Command>
                )}
            </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isCheckingIn}>
            Cancel
          </Button>
          <Button onClick={handleCheckIn} disabled={!selectedPatient || !selectedDoctor || isCheckingIn}>
            {isCheckingIn ? 'Checking In...' : 'Confirm Check-in'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
