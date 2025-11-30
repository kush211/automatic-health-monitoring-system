
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { GeneratePatientSummaryOutput } from "@/ai/flows/generate-patient-summary";
import { RefreshCw, FileText } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summaryResult: GeneratePatientSummaryOutput | null;
  patientName: string;
  isLoading: boolean;
  onRegenerate: () => void;
}

export function SummaryModal({
  isOpen,
  onClose,
  summaryResult,
  patientName,
  isLoading,
  onRegenerate,
}: SummaryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Summary for {patientName}
          </DialogTitle>
          <DialogDescription>
            This is an automated summary of {patientName}'s medical history. For clinical use only.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="space-y-6 p-1">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              summaryResult && (
                <div className="space-y-2">
                  <div className="bg-muted/50 p-4 rounded-md text-foreground prose prose-sm max-w-none">
                   <p>{summaryResult.summary}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </ScrollArea>

        <Separator/>

        <DialogFooter className="sm:justify-between pt-4">
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate Summary
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
