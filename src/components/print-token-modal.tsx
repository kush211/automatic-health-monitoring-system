
"use client";

import { useRef, useEffect, useState } from 'react';
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
import { Stethoscope, Printer } from "lucide-react";
import type { Appointment } from '@/lib/types';
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
  const tokenRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handlePrint = () => {
    if (!tokenRef.current) return;
    
    const printContents = tokenRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=400,height=600");

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Appointment Token</title>
            <style>
              body { 
                font-family: 'PT Sans', sans-serif; 
                text-align: center;
                padding: 20px;
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
              }
              h2 { font-family: 'Playfair Display', serif; }
              .text-primary { color: #388E3C; }
              .text-muted-foreground { color: #555; }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

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
                    <p>Issued at: {mounted ? format(new Date(), 'dd-MMM-yyyy, h:mm a') : ''}</p>
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
