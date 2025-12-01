
"use client";

import { useRef, useEffect, useState } from 'react';
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
import type { Patient, BillItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { BillableServices } from '@/lib/services';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onBillGenerated: (patientId: string, billDetails: { subtotal: number, insuranceAdjustment: number, totalDue: number, items: BillItem[]}) => void;
}

export function GenerateBillModal({
  isOpen,
  onClose,
  patient,
  onBillGenerated
}: GenerateBillModalProps) {
  const billRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [insuranceAdjustment, setInsuranceAdjustment] = useState(-20000); 

  const handlePrint = () => {
    if (!billRef.current) return;

    const printContents = billRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
  
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Bill</title>
             <style>
              body { 
                font-family: 'PT Sans', sans-serif; 
                padding: 20px; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
              }
              table { width: 100%; border-collapse: collapse; }
              th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
              th { font-weight: bold; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .text-primary { color: #388E3C; }
              .text-muted-foreground { color: #555; }
              .text-lg { font-size: 1.125rem; }
              .bg-muted-50 { background-color: #F1F8E9; }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchBillableServices = async () => {
        setIsLoading(true);
        const db = getFirestore();
        const billableServicesRef = collection(db, 'patients', patient.patientId, 'billable_services');
        const servicesSnapshot = await getDocs(billableServicesRef);
        
        let calculatedSubtotal = 0;
        const items: BillItem[] = [];

        servicesSnapshot.forEach(doc => {
            const service = doc.data();
            const serviceInfo = BillableServices[service.serviceCode as keyof typeof BillableServices];
            if (serviceInfo) {
                const total = serviceInfo.unitPrice * service.quantity;
                items.push({
                    name: serviceInfo.name,
                    unitPrice: serviceInfo.unitPrice,
                    qty: service.quantity,
                    total: total,
                });
                calculatedSubtotal += total;
            }
        });
        
        // Add a mock consultation fee if no other services are present
        if (items.length === 0) {
            const consultService = BillableServices['consult_fee'];
            const total = consultService.unitPrice * 1;
            items.push({
                name: consultService.name,
                unitPrice: consultService.unitPrice,
                qty: 1,
                total: total,
            });
            calculatedSubtotal += total;
        }

        setBillItems(items);
        setSubtotal(calculatedSubtotal);
        setTotalDue(calculatedSubtotal + insuranceAdjustment);
        setIsLoading(false);
    };

    fetchBillableServices();
  }, [isOpen, patient, insuranceAdjustment]);

  useEffect(() => {
    setTotalDue(subtotal + insuranceAdjustment);
  }, [subtotal, insuranceAdjustment]);


  const handleFinalizeBill = () => {
    onBillGenerated(patient.patientId, { subtotal, insuranceAdjustment, totalDue, items: billItems });
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
            {isLoading ? (
                <div className="space-y-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                     <Skeleton className="h-20 w-full" />
                </div>
            ) : (
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
            )}
            </div>
            <div className="px-6 py-4 border-t">
              <Label htmlFor="insurance-adjustment">Insurance Adjustment (₹)</Label>
              <Input 
                id="insurance-adjustment"
                type="number"
                value={insuranceAdjustment}
                onChange={(e) => setInsuranceAdjustment(parseFloat(e.target.value) || 0)}
                className="mt-2"
                placeholder="e.g., -5000"
              />
            </div>
        </ScrollArea>

        <Separator/>

        <DialogFooter className="pt-4 flex-wrap gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={isLoading}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Bill
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleFinalizeBill} disabled={isLoading}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalize and Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
