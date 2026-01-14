import { type ColumnDef } from "@tanstack/react-table";
import { LaptopActionsCell } from "./laptopActionCell";
import { LaptopStatusBadge } from "./laptopStatusBadge";
import type { LaptopDetails } from "@/types/types";

export const columns: ColumnDef<LaptopDetails>[] = [
  {
    accessorKey: "systemName",
    header: "System Name",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
{
    accessorKey: "model",
    header: "Model",
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
      return <LaptopActionsCell laptop={row.original} />;
    },
  },
];
