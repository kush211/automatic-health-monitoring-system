
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
import { ArrowRightLeft } from "lucide-react";
import type { Appointment, User } from "@/lib/types";

interface TransferAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTransfer: (doctor: User) => void;
  doctors: User[];
  appointment: Appointment;
}

export function TransferAppointmentModal({
  isOpen,
  onClose,
  onConfirmTransfer,
  doctors,
  appointment,
}: TransferAppointmentModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);

  const handleSelectDoctor = (doctor: User) => {
    setSelectedDoctor(doctor);
  };

  const handleTransfer = () => {
    if (selectedDoctor) {
      onConfirmTransfer(selectedDoctor);
      setSelectedDoctor(null);
    }
  };
  
  const handleClose = () => {
    setSelectedDoctor(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
            Transfer Appointment
          </DialogTitle>
          <DialogDescription>
            Transfer {appointment.patientName}'s appointment to another doctor.
          </DialogDescription>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search for a doctor..." />
          <ScrollArea className="h-48">
            <CommandList>
              <CommandEmpty>No doctors found.</CommandEmpty>
              <CommandGroup>
                {doctors.map((doctor) => (
                  <CommandItem
                    key={doctor.uid}
                    value={doctor.name}
                    onSelect={() => handleSelectDoctor(doctor)}
                    className={selectedDoctor?.uid === doctor.uid ? "bg-accent" : ""}
                  >
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
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleTransfer} disabled={!selectedDoctor}>
            Confirm Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    