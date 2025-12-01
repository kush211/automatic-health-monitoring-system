
'use client';
import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppContext } from "@/hooks/use-app-context";
import type { Patient, BillItem } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GenerateBillModal } from "@/components/generate-bill-modal";
import { History } from "lucide-react";

export default function BillingPage() {
  const { dischargedPatientsForBilling, generateBillForPatient } = useAppContext();
  const [isBillModalOpen, setIsBillModalOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);

  const handleOpenBillModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsBillModalOpen(true);
  };
  
  const handleCloseBillModal = () => {
    setIsBillModalOpen(false);
    setSelectedPatient(null);
  };
  
  const handleBillGenerated = (patientId: string, billDetails: { subtotal: number; insuranceAdjustment: number; totalDue: number; items: BillItem[] }) => {
    generateBillForPatient(patientId, billDetails);
    handleCloseBillModal();
  };

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "name",
      header: "Patient Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="capitalize font-medium">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "patientId",
      header: "Patient ID",
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Button onClick={() => handleOpenBillModal(row.original)}>
              Generate Bill
            </Button>
          </div>
        );
      },
    },
  ];
  
  const table = useReactTable({
    data: dischargedPatientsForBilling,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Billing</h1>
            <p className="text-muted-foreground">
            Generate final bills for discharged patients.
            </p>
        </div>
        <Button asChild variant="outline">
            <Link href="/billing/history">
                <History className="mr-2 h-4 w-4" />
                View Billing History
            </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No patients waiting for billing.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedPatient && (
         <GenerateBillModal 
            isOpen={isBillModalOpen}
            onClose={handleCloseBillModal}
            patient={selectedPatient}
            onBillGenerated={handleBillGenerated}
         />
      )}
    </div>
  );
}
