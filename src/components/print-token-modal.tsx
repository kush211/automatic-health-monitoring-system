"use client";

import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Stethoscope, Printer, User, Clock } from "lucide-react";
import type { Appointment } from '@/lib/types';
import { useReactToPrint } from 'react-to-print';
import { format } from 'date-fns';

interface PrintTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  queueNumber: number;
}

export function PrintTokenModal({
  isOpen,
  onClose,
  appointment,
  queueNumber
}: PrintTokenModalProps) {
  const tokenRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    content: () => tokenRef.current,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <Printer className="h-6 w-6 text-primary" />
            Print Appointment Token
          </DialogTitle>
          <DialogDescription>
            Print a token for {appointment.patientName} to help them track their turn.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <div ref={tokenRef} className="p-4 printable-area bg-background rounded-lg border-2 border-dashed">
            <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-2">
                    <Stethoscope className="w-8 h-8 text-primary" />
                    <h2 className="text-xl font-bold">HealthHub Rural Clinic</h2>
                </div>

                <Separator className='my-4'/>

                <div>
                    <p className="text-sm text-muted-foreground">Token Number</p>
                    <p className="text-8xl font-bold tracking-tighter text-primary">{queueNumber}</p>
                </div>
                
                <div className='space-y-1'>
                    <p className="font-semibold text-lg">{appointment.patientName}</p>
                    <p className="text-muted-foreground">is visiting</p>
                    <p className="font-semibold text-lg">{appointment.doctorName}</p>
                </div>

                <Separator className='my-4'/>

                <div className='text-xs text-muted-foreground'>
                    <p>Issued at: {format(new Date(), 'dd-MMM-yyyy, h:mm a')}</p>
                    <p className='mt-2'>Please wait for your token number to be displayed on the screen.</p>
                </div>
            </div>
        </div>

        <Separator/>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
