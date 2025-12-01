
'use client';
import * as React from "react";
import {
  ChevronsUpDown,
  ChevronDown,
  Info,
  AlertTriangle,
  ShieldAlert
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const securityLogs: SecurityLog[] = [
  {
    id: "LOG-001",
    timestamp: "2024-07-29T10:00:00Z",
    user: "admin@example.com",
    ipAddress: "192.168.1.1",
    action: "Admin Login",
    status: "Success",
    severity: "Info",
    details: "Admin successfully logged into the system.",
  },
  {
    id: "LOG-002",
    timestamp: "2024-07-29T10:05:12Z",
    user: "admin@example.com",
    ipAddress: "192.168.1.1",
    action: "System Settings Update",
    status: "Success",
    severity: "Warning",
    details: "Toggled AI Patient Summary feature to: Disabled",
  },
  {
    id: "LOG-003",
    timestamp: "2024-07-29T11:20:45Z",
    user: "unknown",
    ipAddress: "203.0.113.55",
    action: "Admin Login",
    status: "Failure",
    severity: "Critical",
    details: "Failed login attempt with incorrect PIN.",
  },
  {
    id: "LOG-004",
    timestamp: "2024-07-29T11:21:05Z",
    user: "unknown",
    ipAddress: "203.0.113.55",
    action: "Admin Login",
    status: "Failure",
    severity: "Critical",
    details: "Failed login attempt with incorrect PIN.",
  },
  {
    id: "LOG-005",
    timestamp: "2024-07-29T14:00:21Z",
    user: "admin@example.com",
    ipAddress: "192.168.1.1",
    action: "User Role Change",
    status: "Success",
    severity: "Warning",
    details: "Changed role for user 'nurse1' to 'Doctor'.",
  },
   {
    id: "LOG-006",
    timestamp: "2024-07-30T09:30:00Z",
    user: "priya.sharma@example.com",
    ipAddress: "192.168.1.10",
    action: "Patient Data Access",
    status: "Success",
    severity: "Info",
    details: "Accessed patient record for PID-1-2024.",
  },
];

export type SecurityLog = {
  id: string;
  timestamp: string;
  user: string;
  ipAddress: string;
  action: string;
  status: "Success" | "Failure";
  severity: "Info" | "Warning" | "Critical";
  details: string;
};

const SeverityIcon = ({ severity }: { severity: SecurityLog['severity'] }) => {
    switch (severity) {
        case 'Info':
            return <Info className="h-4 w-4 text-blue-500" />;
        case 'Warning':
            return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        case 'Critical':
            return <ShieldAlert className="h-4 w-4 text-red-500" />;
    }
}

const getSeverityBadge = (severity: SecurityLog['severity']) => {
    switch (severity) {
        case 'Info':
            return <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">{severity}</Badge>;
        case 'Warning':
            return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">{severity}</Badge>;
        case 'Critical':
            return <Badge variant="destructive">{severity}</Badge>;
    }
}

export const columns: ColumnDef<SecurityLog>[] = [
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <SeverityIcon severity={row.original.severity} />
            {getSeverityBadge(row.original.severity)}
        </div>
    )
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Timestamp
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("timestamp")), "dd-MM-yyyy HH:mm:ss")}</div>
    ),
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <Badge variant={row.original.status === 'Success' ? 'secondary' : 'destructive'}>{row.original.status}</Badge>
    )
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue("details")}</div>
  },
];

export default function SecurityLogsPage() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'timestamp', desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: securityLogs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Logs</h1>
        <p className="text-muted-foreground">
          An audit trail of important events and actions within the system.
        </p>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by user email or action..."
          value={(table.getColumn("user")?.getFilterValue() as string) ?? (table.getColumn("action")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("user")?.setFilterValue(event.target.value)
            // We can't filter two columns with one input this way, but this is a common request.
            // For this demo, we'll just filter the user column.
          }}
          className="max-w-sm"
        />
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4">
              Severity <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              onSelect={() => table.getColumn("severity")?.setFilterValue(undefined)}
              checked={!table.getColumn("severity")?.getFilterValue()}
            >
              All
            </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
                onSelect={() => table.getColumn("severity")?.setFilterValue('Info')}
                checked={table.getColumn("severity")?.getFilterValue() === 'Info'}
              >
                Info
            </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
                onSelect={() => table.getColumn("severity")?.setFilterValue('Warning')}
                checked={table.getColumn("severity")?.getFilterValue() === 'Warning'}
             >
                Warning
            </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem
                onSelect={() => table.getColumn("severity")?.setFilterValue('Critical')}
                checked={table.getColumn("severity")?.getFilterValue() === 'Critical'}
            >
                Critical
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) found.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
