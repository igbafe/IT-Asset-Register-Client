import { type LaptopDetails } from "@/store/laptopDetailsStore";
import { type ColumnDef } from "@tanstack/react-table";
import { LaptopActionsCell } from "./laptopActionCell";
import { LaptopStatusBadge } from "./laptopStatusBadge";

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
    header: "RAM",
  },
  {
    accessorKey: "rom",
    header: "Storage",
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <LaptopActionsCell laptop={row.original} />;
    },
  },
];
