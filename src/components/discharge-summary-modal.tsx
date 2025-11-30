
"use client";

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { GenerateDischargeSummaryOutput } from "@/ai/flows/generate-discharge-summary";
import { FileText, Printer, CheckCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface DischargeSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: GenerateDischargeSummaryOutput | null;
  isLoading: boolean;
  onConfirmDischarge: () => void;
}

export function DischargeSummaryModal({
  isOpen,
  onClose,
  summary,
  isLoading,
  onConfirmDischarge,
}: DischargeSummaryModalProps) {
  const summaryRef = useRef(null);

  const handlePrint = () => {
    if (summaryRef.current) {
      html2canvas(summaryRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const ratio = canvasHeight / canvasWidth;
        const imgHeight = pdfWidth * ratio;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = -heightLeft;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
        
        pdf.autoPrint();
        pdf.output('dataurlnewwindow');
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Discharge Summary
          </DialogTitle>
          <DialogDescription>
            AI-generated discharge summary for {summary?.patientName || "the patient"}. Review, print, and confirm discharge.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <ScrollArea className="flex-1 min-h-0 pr-6 -mr-6">
          <div ref={summaryRef} className="p-4 sm:p-6 printable-area bg-background">
            {isLoading ? (
              <div className="space-y-6">
                 <Skeleton className="h-8 w-3/4" />
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                 </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-12 w-full" />
                 </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-12 w-full" />
                 </div>
              </div>
            ) : (
              summary && (
                <div className="space-y-6">
                  <header className="space-y-2">
                    <h1 className="text-3xl font-bold text-center">Discharge Summary</h1>
                    <div className="flex justify-between items-center text-sm text-muted-foreground border-y py-2">
                        <span>
                            <strong>Patient:</strong> {summary.patientName}
                        </span>
                        <span>
                            <strong>Discharge Date:</strong> {summary.dischargeDate}
                        </span>
                    </div>
                  </header>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      <div><strong>Date of Admission:</strong> {summary.admissionDate}</div>
                      <div><strong>Attending Physician:</strong> {summary.attendingPhysician}</div>
                  </div>

                  <section className="space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-1">Reason for Admission</h3>
                    <p className="text-muted-foreground">{summary.reasonForAdmission}</p>
                  </section>

                   <section className="space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-1">Treatment Summary</h3>
                    <p className="text-muted-foreground">{summary.treatmentSummary}</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-1">Condition at Discharge</h3>
                    <p className="text-muted-foreground">{summary.dischargeCondition}</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-1">Follow-up Instructions</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{summary.followUpInstructions}</p>
                  </section>
                </div>
              )
            )}
          </div>
        </ScrollArea>

        <Separator/>

        <DialogFooter className="pt-4 flex-wrap gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={isLoading || !summary}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Summary
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
                onClick={onConfirmDischarge}
                disabled={isLoading || !summary}
            >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm and Discharge
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
