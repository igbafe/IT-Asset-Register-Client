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
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "ram",
    header: "RAM (GB)",
  },
  {
    accessorKey: "rom",
    header: "Storage (GB)",
  },
  {
    accessorKey: "os",
    header: "Operating System",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <LaptopStatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "retirementDate",
    header: "Retirement Date",
    cell: ({ row }) => {
      const value = row.getValue("retirementDate");

      if (
        !value ||
        (typeof value !== "string" &&
          typeof value !== "number" &&
          !(value instanceof Date))
      ) {
        return "—";
      }

      const date = new Date(value);
      if (isNaN(date.getTime())) return "—";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "retirementNote",
    header: "Retirement Note",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <LaptopActionsCell laptop={row.original} />;
    },
  },
];
