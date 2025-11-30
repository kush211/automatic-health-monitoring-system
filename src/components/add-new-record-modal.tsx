
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { FilePlus } from "lucide-react";
import { Separator } from "./ui/separator";
import { demoUser } from "@/lib/data";

interface AddNewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onRecordAdded: (newRecord: any) => void;
}

export function AddNewRecordModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  onRecordAdded,
}: AddNewRecordModalProps) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptionIssued, setPrescriptionIssued] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!diagnosis) {
      toast({
        title: "Missing Information",
        description: "Please fill in the Diagnosis field.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newRecord = {
      date: new Date().toLocaleDateString("en-GB"),
      diagnosis,
      doctor: demoUser.name,
      notes,
      prescription: prescriptionIssued,
      labReports: 0,
    };

    onRecordAdded(newRecord);
    setIsSaving(false);
    
    // Reset form state
    setDiagnosis("");
    setNotes("");
    setPrescriptionIssued(false);

    onClose();
    toast({
      title: "Record Added",
      description: `A new medical record has been added for ${patientName}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePlus className="h-6 w-6 text-primary" />
            Add New Medical Record
          </DialogTitle>
          <DialogDescription>
            Add a new record for {patientName}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="diagnosis" className="text-right">
              Diagnosis
            </Label>
            <Input
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prescription" className="text-right">
              Prescription
            </Label>
            <Switch
              id="prescription"
              checked={prescriptionIssued}
              onCheckedChange={setPrescriptionIssued}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
