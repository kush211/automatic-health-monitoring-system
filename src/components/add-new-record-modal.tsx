
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
import { FilePlus, PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { demoUser } from "@/lib/data";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ScrollArea } from "./ui/scroll-area";

interface AddNewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onRecordAdded: (newRecord: any) => void;
}

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  timing: "before" | "after";
  notes: string;
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

  // New state for modular prescription
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [timing, setTiming] = useState<"before" | "after">("after");
  const [medNotes, setMedNotes] = useState("");

  const { toast } = useToast();

  const handleAddMedicine = () => {
    if (!medName || !dosage) {
      toast({
        title: "Missing Information",
        description: "Please fill in Medicine Name and Dosage.",
        variant: "destructive",
      });
      return;
    }
    setMedicines([
      ...medicines,
      { id: Date.now(), name: medName, dosage, timing, notes: medNotes },
    ]);
    // Reset fields
    setMedName("");
    setDosage("");
    setTiming("after");
    setMedNotes("");
  };
  
  const handleRemoveMedicine = (id: number) => {
    setMedicines(medicines.filter(med => med.id !== id));
  }

  const formatPrescriptionDetails = () => {
    return medicines
      .map(
        (med) =>
          `- ${med.name} ${med.dosage}\n  Take ${med.timing === 'before' ? 'before' : 'after'} food.${med.notes ? `\n  Notes: ${med.notes}` : ''}`
      )
      .join("\n\n");
  };

  const handleSave = async () => {
    if (!diagnosis) {
      toast({
        title: "Missing Information",
        description: "Please fill in the Diagnosis field.",
        variant: "destructive",
      });
      return;
    }

    if (prescriptionIssued && medicines.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one medicine to the prescription.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const prescriptionDetails = prescriptionIssued ? formatPrescriptionDetails() : "";

    const newRecord = {
      date: new Date().toLocaleDateString("en-GB"),
      diagnosis,
      doctor: demoUser.name,
      notes,
      prescription: prescriptionIssued,
      prescriptionDetails,
      labReports: 0,
    };

    onRecordAdded(newRecord);
    setIsSaving(false);
    
    // Reset form state
    setDiagnosis("");
    setNotes("");
    setPrescriptionIssued(false);
    setMedicines([]);
    setMedName("");
    setDosage("");
    setTiming("after");
    setMedNotes("");

    onClose();
    toast({
      title: "Record Added",
      description: `A new medical record has been added for ${patientName}.`,
    });
  };
  
  const handleClose = () => {
    // Reset state on close
    setDiagnosis("");
    setNotes("");
    setPrescriptionIssued(false);
    setMedicines([]);
    setMedName("");
    setDosage("");
    setTiming("after");
    setMedNotes("");
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FilePlus className="h-6 w-6 text-primary" />
            Add New Medical Record
          </DialogTitle>
          <DialogDescription>
            Add a new record for {patientName}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="flex-grow min-h-0 pr-6 -mr-6">
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Visit Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prescription" className="text-right">
              Issue Prescription
            </Label>
            <Switch
              id="prescription"
              checked={prescriptionIssued}
              onCheckedChange={setPrescriptionIssued}
            />
          </div>

          {prescriptionIssued && (
            <>
              <Separator className="my-2" />
              <div className="grid grid-cols-4 items-start gap-4">
                 <Label className="text-right pt-2 font-semibold">
                    Prescription
                 </Label>
                 <div className="col-span-3 grid gap-4">
                    <ScrollArea className="h-48 w-full rounded-md border p-4">
                        {medicines.length > 0 ? (
                            <div className="space-y-4">
                                {medicines.map(med => (
                                    <div key={med.id} className="flex items-start justify-between gap-2 bg-muted/50 p-3 rounded-md">
                                        <div>
                                            <p className="font-medium">{med.name} <span className="text-muted-foreground font-normal">{med.dosage}</span></p>
                                            <p className="text-sm text-muted-foreground">Take {med.timing} food</p>
                                            {med.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {med.notes}</p>}
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveMedicine(med.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">No medicines added yet.</p>
                        )}
                    </ScrollArea>
                    
                    <div className="space-y-4 rounded-md border p-4">
                        <h4 className="text-sm font-semibold">Add Medicine</h4>
                         <div className="grid sm:grid-cols-2 gap-4">
                             <div className="grid gap-2">
                                <Label htmlFor="med-name">Medicine Name</Label>
                                <Input id="med-name" value={medName} onChange={e => setMedName(e.target.value)} placeholder="e.g., Paracetamol"/>
                             </div>
                             <div className="grid gap-2">
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input id="dosage" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g., 500mg"/>
                             </div>
                         </div>
                         <div className="grid gap-2">
                            <Label>Timing</Label>
                            <RadioGroup value={timing} onValueChange={(v: "before" | "after") => setTiming(v)} className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="before" id="before-food" />
                                    <Label htmlFor="before-food">Before Food</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="after" id="after-food" />
                                    <Label htmlFor="after-food">After Food</Label>
                                </div>
                            </RadioGroup>
                         </div>
                         <div className="grid gap-2">
                            <Label htmlFor="med-notes">Notes (Optional)</Label>
                            <Textarea id="med-notes" value={medNotes} onChange={e => setMedNotes(e.target.value)} placeholder="e.g., for 3 days" rows={2}/>
                         </div>
                         <Button variant="outline" size="sm" onClick={handleAddMedicine} className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Medicine to Prescription
                         </Button>
                    </div>
                 </div>
              </div>
            </>
          )}
        </div>
        </ScrollArea>
        <DialogFooter className="flex-shrink-0 mt-auto pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
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

  