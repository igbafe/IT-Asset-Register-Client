import type { Assignment } from "@/store/assignmentStore";
import type { ColumnDef } from "@tanstack/react-table";
import { AssignmentStatusBadge } from "./AssignmentStatusBadge";
import { AssignmentActionsCell } from "./AssignmentActionCell";


export const assignmentColumns: ColumnDef<Assignment>[] = [
  {
    accessorKey: "systemName",
    header: "System Name",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "assignedDate",
    header: "Assigned Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("assignedDate"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <AssignmentStatusBadge status={row.getValue("status")} />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <AssignmentActionsCell assignment={row.original} />;
    },
  },
];
