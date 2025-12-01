
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { FileText, Printer, CheckCircle, Stethoscope } from "lucide-react";
import type { Patient, Bill, BillItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { BillableServices } from '@/lib/services';
import { useAppContext } from '@/hooks/use-app-context';

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onBillGenerated: (patientId: string, billDetails: Omit<Bill, 'id' | 'billId' | 'status' | 'generatedAt' | 'generatedBy'>) => void;
}

// Mock function to get charges for a patient
const getPatientCharges = (patient: Patient): { billItems: BillItem[], subtotal: number, insuranceAdjustment: number, totalDue: number } => {
    // In a real app, this would come from a database of services rendered.
    // For now, we'll create a sample charge sheet based on the mock data.
    const items = [
        { service: BillableServices['icu_stay'], qty: 5 },
        { service: BillableServices['consult_fee'], qty: 2 },
        { service: BillableServices['angioplasty'], qty: 1 },
        { service: BillableServices['lipid_profile'], qty: 1 },
        { service: BillableServices['med_atorvastatin'], qty: 30 },
        { service: BillableServices['med_aspirin'], qty: 30 },
    ];
    
    const billItems = items.map(item => ({
        name: item.service.name,
        unitPrice: item.service.unitPrice,
        qty: item.qty,
        total: item.service.unitPrice * item.qty,
    }));

    const subtotal = billItems.reduce((acc, item) => acc + item.total, 0);
    const insuranceAdjustment = -20000; // Mock adjustment
    const totalDue = subtotal + insuranceAdjustment;

    return { billItems, subtotal, insuranceAdjustment, totalDue };
};


export function GenerateBillModal({
  isOpen,
  onClose,
  patient,
  onBillGenerated
}: GenerateBillModalProps) {
  const billRef = useRef(null);
  const { toast } = useToast();
  
  const { billItems, subtotal, insuranceAdjustment, totalDue } = getPatientCharges(patient);

  const handlePrint = () => {
    if (billRef.current) {
      html2canvas(billRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const ratio = canvasHeight / canvasWidth;
        const imgHeight = pdfWidth * ratio;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        pdf.autoPrint();
        pdf.output('dataurlnewwindow');
      });
    }
  };

  const handleFinalizeBill = () => {
    const billDetails = {
        id: `INV-${patient.patientId.slice(4,8)}-${Date.now()}`,
        patientId: patient.patientId,
        items: billItems,
        subtotal,
        insuranceAdjustment,
        totalDue,
    };
    onBillGenerated(patient.patientId, billDetails);
    toast({
        title: "Bill Finalized",
        description: `The final bill for ${patient.name} has been generated.`,
    });
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Generate Bill for {patient.name}
          </DialogTitle>
          <DialogDescription>
            Review the itemized bill, print it, and then finalize it.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        
        <ScrollArea className="flex-1 min-h-0 pr-6 -mr-6">
          <div ref={billRef} className="p-4 sm:p-6 printable-area bg-background">
              <div className="space-y-6">
                <header className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <Stethoscope className="w-10 h-10 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">HealthHub Rural Clinic</h1>
                                <p className="text-sm text-muted-foreground">123 Health St, Wellness City, 12345</p>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-right text-primary">INVOICE</h2>
                    </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground border-y py-2">
                      <div>
                          <p className="font-semibold text-foreground">Bill To:</p>
                          <p>{patient.name}</p>
                          <p>{patient.address}</p>
                          <p>{patient.phone}</p>
                      </div>
                      <div className='text-right'>
                          <p><strong>Invoice #:</strong> INV-{patient.patientId.slice(4,8)}-{new Date().getFullYear()}</p>
                          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                      </div>
                  </div>
                </header>
                
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50%]">Service / Item</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {billItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.qty}</TableCell>
                                <TableCell>₹{item.unitPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} className="text-right font-semibold">Subtotal</TableCell>
                            <TableCell className="text-right font-semibold">₹{subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell colSpan={3} className="text-right">Insurance Adjustment</TableCell>
                            <TableCell className="text-right text-green-600">₹{insuranceAdjustment.toFixed(2)}</TableCell>
                        </TableRow>
                         <TableRow className="text-lg font-bold bg-muted/50">
                            <TableCell colSpan={3} className="text-right">Total Due</TableCell>
                            <TableCell className="text-right">₹{totalDue.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
              </div>
            </div>
        </ScrollArea>

        <Separator/>

        <DialogFooter className="pt-4 flex-wrap gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Bill
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleFinalizeBill}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalize and Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
