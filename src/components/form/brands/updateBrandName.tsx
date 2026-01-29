import CustomFormField from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/constants/constants";
import useBrandStore from "@/store/useBrandStore";
import type { Brand } from "@/types/types";
import {
  updateBrandSchema,
  type UpdateBrandFormData,
} from "@/validation/brandSetting";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";

interface UpdateBrandNameProps {
  brand: Brand; // Brand from table row
}

const UpdateBrandName = ({ brand }: UpdateBrandNameProps) => {
  const [open, setOpen] = useState(false);
  const { updateBrand } = useBrandStore();

  const form = useForm<UpdateBrandFormData>({
    resolver: zodResolver(updateBrandSchema),
    defaultValues: {
      newBrandName: "",
    },
  });

  const onSubmit = async (values: UpdateBrandFormData) => {
    if (!brand) {
      toast.error("Brand name is missing");
      return;
    }

    const result = await updateBrand(brand.brandName, values.newBrandName);
    if (result.success) {
      form.reset();
      setOpen(false);
      toast.success(result.message || "Brand name updated successfully!");
    } else {
      toast.error(result.error || "Failed to update brand name");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-emerald-600 hover:text-emerald-700 cursor-pointer hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950 flex items-center gap-1.5"
          title="Edit Brand Name"
        >
          <Pencil size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Brand Name</DialogTitle>
          <DialogDescription>
            Fill in the details below to update a brand name.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="newBrandName"
                label="Brand Name"
                placeholder="Enter new brand name"
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full sm:w-auto">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                type="button"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Update Brand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBrandName;
