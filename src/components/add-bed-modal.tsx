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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BedDouble } from "lucide-react";

interface AddBedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBed: (ward: "General" | "ICU" | "Maternity") => void;
}

export function AddBedModal({ isOpen, onClose, onAddBed }: AddBedModalProps) {
  const [ward, setWard] = useState<"General" | "ICU" | "Maternity">("General");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    onAddBed(ward);
    // Reset state after a delay to show loading
    setTimeout(() => {
        setIsSaving(false);
        onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BedDouble className="h-6 w-6 text-primary" />
            Add New Bed
          </DialogTitle>
          <DialogDescription>
            Add a new bed to a ward. The bed number will be assigned automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ward" className="text-right">
              Ward
            </Label>
            <Select onValueChange={(value: "General" | "ICU" | "Maternity") => setWard(value)} defaultValue={ward}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="ICU">ICU</SelectItem>
                <SelectItem value="Maternity">Maternity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Adding..." : "Add Bed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
