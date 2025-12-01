
"use client";

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { FileText, Printer, Stethoscope } from "lucide-react";
import type { Bill } from '@/lib/types';

interface ViewBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill;
}

export function ViewBillModal({
  isOpen,
  onClose,
  bill,
}: ViewBillModalProps) {
  const billRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => billRef.current,
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Invoice Details
          </DialogTitle>
          <DialogDescription>
            Viewing invoice {bill.billId} for {bill.patientName}.
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
                          <p>{bill.patientName}</p>
                      </div>
                      <div className='text-right'>
                          <p><strong>Invoice #:</strong> {bill.billId}</p>
                          <p><strong>Date:</strong> {new Date(bill.generatedAt).toLocaleDateString()}</p>
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
                        {bill.items.map((item, index) => (
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
                            <TableCell className="text-right font-semibold">₹{bill.subtotal.toFixed(2)}</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell colSpan={3} className="text-right">Insurance Adjustment</TableCell>
                            <TableCell className="text-right text-green-600">₹{bill.insuranceAdjustment.toFixed(2)}</TableCell>
                        </TableRow>
                         <TableRow className="text-lg font-bold bg-muted/50">
                            <TableCell colSpan={3} className="text-right">Total Due</TableCell>
                            <TableCell className="text-right">₹{bill.totalDue.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
              </div>
            </div>
        </ScrollArea>

        <Separator/>

        <DialogFooter className="pt-4 flex-wrap gap-2 sm:justify-between">
            <DialogClose asChild>
                <Button variant="outline">Close</Button>
            </DialogClose>
            <Button
                variant="default"
                onClick={handlePrint}
            >
                <Printer className="mr-2 h-4 w-4" />
                Print Bill
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
