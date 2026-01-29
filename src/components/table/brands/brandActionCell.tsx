import type { Brand } from "@/types/types";
import useBrandStore from "@/store/useBrandStore";
import { useState } from "react";
import UpdateBrandName from "@/components/form/brands/updateBrandName";
import { BrandActionDialog } from "@/components/Settings/brandConfirmation";
import { toast } from "react-toastify";
interface BrandActionsCellProps {
  brands: Brand;
}

export function BrandActionsCell({ brands }: BrandActionsCellProps) {
  const { deleteBrand } = useBrandStore();
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      deleteBrand(brands.brandName);
      setOpen(false);
      toast.success("Brand deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete brand");
    }
  };
  return (
    <div className="flex items-center gap-3">
      <UpdateBrandName brand={brands} />
      <BrandActionDialog
        open={open}
        onOpenChange={setOpen}
        brandName={brands.brandName}
        onConfirm={handleConfirm}
        isDeleting={false}
      />
    </div>
  );
}
