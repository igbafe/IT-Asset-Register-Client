import type { ColumnDef } from "@tanstack/react-table";
import { BrandActionsCell } from "./brandActionCell";
import type { Brand } from "@/types/types";
import { ModelsCell } from "./modelCell";

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "brandName",
    header: "Brand Name",
  },
  {
    accessorKey: "models",
    header: "Models",
    cell: ({ row }) => {
      return <ModelsCell brand={row.original} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <BrandActionsCell brands={row.original} />;
    },
  },
];
