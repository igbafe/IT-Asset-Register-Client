import type { Assignment } from "@/types/types";
import type { ColumnDef } from "@tanstack/react-table";
import { LaptopStatusBadge } from "../laptopDetails/laptopStatusBadge";
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
    accessorKey: "currentUser.fullName",
    header: "Full Name",
  },
  {
    accessorKey: "currentUser.email",
    header: "Email",
  },
  {
    accessorKey: "currentUser.department",
    header: "Department",
  },
  {
    accessorKey: "currentUser.assignedDate",
    header: "Assigned Date",
    cell: ({ row }) => {
      const assignedDate = row.original.currentUser?.assignedDate;
      if (!assignedDate) return "—"; // Handle undefined case

      const date = new Date(assignedDate);
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
    cell: ({ row }) => <LaptopStatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <AssignmentActionsCell assignment={row.original} />;
    },
  },
];
