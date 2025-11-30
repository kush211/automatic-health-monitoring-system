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
import { UserPlus } from "lucide-react";
import type { Patient } from "@/lib/types";

interface AssignPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignPatient: (patient: Patient) => void;
  patients: Patient[];
  bedId?: string;
}

export function AssignPatientModal({
  isOpen,
  onClose,
  onAssignPatient,
  patients,
  bedId,
}: AssignPatientModalProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleAssign = () => {
    if (selectedPatient) {
      onAssignPatient(selectedPatient);
      setSelectedPatient(null);
    }
  };
  
  const handleClose = () => {
    setSelectedPatient(null);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            Assign Patient to {bedId}
          </DialogTitle>
          <DialogDescription>
            Select a patient to assign to this bed.
          </DialogDescription>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search for a patient..." />
          <ScrollArea className="h-48">
            <CommandList>
              <CommandEmpty>No patients found.</CommandEmpty>
              <CommandGroup>
                {patients.map((patient) => (
                  <CommandItem
                    key={patient.patientId}
                    value={patient.name}
                    onSelect={() => handleSelectPatient(patient)}
                    className={selectedPatient?.patientId === patient.patientId ? "bg-accent" : ""}
                  >
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
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedPatient}>
            Assign Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
