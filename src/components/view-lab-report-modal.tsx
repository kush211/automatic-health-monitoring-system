
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
import { FileText } from "lucide-react";
import Image from "next/image";

interface ViewLabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  report: {
    date: string;
    reportName: string;
  } | null;
}

export function ViewLabReportModal({
  isOpen,
  onClose,
  patientName,
  report,
}: ViewLabReportModalProps) {
  if (!report) return null;

  // Use a hash of the report name to get a consistent but unique image
  const seed = report.reportName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Lab Report for {patientName}
          </DialogTitle>
          <DialogDescription>
            Report: {report.reportName} - Dated: {new Date(report.date).toLocaleDateString('en-GB')}
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <ScrollArea className="max-h-[70vh] pr-6 -mr-6">
          <div className="p-1 space-y-4">
            <p className="text-sm text-muted-foreground">This is a placeholder for the actual lab report PDF or image.</p>
            <div className="relative w-full h-[60vh] bg-muted rounded-md overflow-hidden">
                <Image
                    src={`https://picsum.photos/seed/${seed}/800/1100`}
                    alt={`Sample report for ${report.reportName}`}
                    layout="fill"
                    objectFit="contain"
                    data-ai-hint="lab report"
                />
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
