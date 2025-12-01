
'use client';
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
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
import type { Bill } from "@/lib/types";
import { ArrowUpDown, Printer } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ViewBillModal } from "@/components/view-bill-modal";

export default function BillingHistoryPage() {
  const { billedPatients } = useAppContext();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isViewBillModalOpen, setIsViewBillModalOpen] = React.useState(false);
  const [selectedBill, setSelectedBill] = React.useState<Bill | null>(null);

  const handleOpenViewBillModal = (bill: Bill) => {
    setSelectedBill(bill);
    setIsViewBillModalOpen(true);
  };
  
  const columns: ColumnDef<Bill>[] = [
    {
      accessorKey: "billId",
      header: "Invoice #",
    },
    {
      accessorKey: "patientName",
      header: "Patient Name",
    },
    {
      accessorKey: "generatedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
          return format(new Date(row.original.generatedAt), 'dd MMM, yyyy');
      }
    },
    {
      accessorKey: "totalDue",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalDue"))
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount)
   
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">{row.original.status}</Badge>
        }
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenViewBillModal(row.original)}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                </div>
            )
        }
    }
  ];
  
  const table = useReactTable({
    data: billedPatients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
        sorting,
    }
  });

  return (
    <>
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing History</h1>
        <p className="text-muted-foreground">
          A record of all finalized and paid bills.
        </p>
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
                  No billing history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
          <Button asChild variant="outline">
              <Link href="/billing">Back to Billing Queue</Link>
          </Button>
      </div>
    </div>
    {selectedBill && (
        <ViewBillModal 
            isOpen={isViewBillModalOpen}
            onClose={() => setIsViewBillModalOpen(false)}
            bill={selectedBill}
        />
    )}
    </>
  );
}
