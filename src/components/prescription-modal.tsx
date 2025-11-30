
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Pill } from "lucide-react";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  record: {
    date: string;
    diagnosis: string;
    doctor: string;
    prescriptionDetails?: string;
  } | null;
}

export function PrescriptionModal({
  isOpen,
  onClose,
  patientName,
  record,
}: PrescriptionModalProps) {
  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            Prescription for {patientName}
          </DialogTitle>
          <DialogDescription>
            Issued on {record.date} by {record.doctor} for {record.diagnosis}.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="space-y-4 p-1">
            <h4 className="font-semibold">Medication Details</h4>
            <div className="bg-muted/50 p-4 rounded-md text-foreground whitespace-pre-wrap">
              {record.prescriptionDetails || "No details provided."}
            </div>
          </div>
        </ScrollArea>

        <Separator/>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
