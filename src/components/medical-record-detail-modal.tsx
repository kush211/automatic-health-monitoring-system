
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
import { FileHeart, Pill, StickyNote } from "lucide-react";

interface MedicalRecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  record: {
    date: string;
    diagnosis: string;
    doctor: string;
    notes?: string;
    prescription?: boolean;
    prescriptionDetails?: string;
  } | null;
}

export function MedicalRecordDetailModal({
  isOpen,
  onClose,
  patientName,
  record,
}: MedicalRecordDetailModalProps) {
  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <FileHeart className="h-6 w-6 text-primary" />
            Medical Record Details
          </DialogTitle>
          <DialogDescription>
            Visit on {record.date} for {patientName}.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <ScrollArea className="max-h-[60vh] pr-6 -mr-6">
          <div className="space-y-6 p-1">
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Diagnosis</p>
                <p className="font-semibold">{record.diagnosis}</p>
            </div>
             <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Consulting Doctor</p>
                <p className="font-semibold">{record.doctor}</p>
            </div>
             {record.notes && (
                <div className="space-y-2">
                    <h4 className="flex items-center gap-2 font-semibold text-base">
                        <StickyNote className="h-5 w-5 text-primary" />
                        Visit Notes
                    </h4>
                    <div className="bg-muted/50 p-4 rounded-md text-foreground prose prose-sm max-w-none">
                        <p>{record.notes}</p>
                    </div>
                </div>
             )}
             {record.prescription && record.prescriptionDetails && (
                 <div className="space-y-2">
                    <h4 className="flex items-center gap-2 font-semibold text-base">
                        <Pill className="h-5 w-5 text-primary" />
                        Prescription Details
                    </h4>
                    <div className="bg-muted/50 p-4 rounded-md text-foreground whitespace-pre-wrap">
                        {record.prescriptionDetails}
                    </div>
                </div>
             )}
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
