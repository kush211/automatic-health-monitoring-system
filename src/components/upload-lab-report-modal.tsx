
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from "lucide-react";
import { format, parseISO } from "date-fns";

interface UploadLabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onReportAdded: (newReport: { reportName: string; date: string }) => void;
}

export function UploadLabReportModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  onReportAdded,
}: UploadLabReportModalProps) {
  const [reportName, setReportName] = useState("");
  const [reportDate, setReportDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!reportName || !reportDate || !fileName) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newReport = {
      reportName,
      date: reportDate,
    };

    onReportAdded(newReport);
    setIsUploading(false);
    onClose();
    toast({
      title: "Report Uploaded",
      description: `${reportName} has been added for ${patientName}.`,
    });
    
    // Reset state
    setReportName("");
    setReportDate(format(new Date(), 'yyyy-MM-dd'));
    setFileName("");
  };

  const handleClose = () => {
     // Reset state on close
    setReportName("");
    setReportDate(format(new Date(), 'yyyy-MM-dd'));
    setFileName("");
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadCloud className="h-6 w-6 text-primary" />
            Upload Lab Report
          </DialogTitle>
          <DialogDescription>
            Upload a new lab report for {patientName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="report-name" className="text-right">
              Report Name
            </Label>
            <Input
              id="report-name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Complete Blood Count"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="report-date" className="text-right">
              Report Date
            </Label>
            <Input
              id="report-date"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-upload" className="text-right">
              File
            </Label>
            <div className="col-span-3">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer w-full">
                  {fileName ? "Change File" : "Select File"}
                </label>
              </Button>
              {fileName && <p className="text-sm text-muted-foreground mt-2">{fileName}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
