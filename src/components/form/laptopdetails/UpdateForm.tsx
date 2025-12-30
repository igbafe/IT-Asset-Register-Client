import { useLaptopStore } from "@/store/useLaptopStore";
import {
  FormFieldType,
  UpdateDetailsSchema,
  type UpdateDetailsFormData,
} from "@/validation/laptopDetailsvalidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { toast } from "react-toastify";

interface UpdateFormProps {
  laptop: {
    systemName: string;
    brand: string;
    model: string;
    serialNumber: string;
    ram: string;
    rom: string;
    os: string;
  };
}

const UpdateForm = ({ laptop }: UpdateFormProps) => {
  const { loading, updateLaptop } = useLaptopStore();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateDetailsFormData>({
    resolver: zodResolver(UpdateDetailsSchema),
    defaultValues: {
      systemName: laptop.systemName,
      brand: laptop.brand,
      model: laptop.model,
      serialNumber: laptop.serialNumber,
      ram: laptop.ram,
      rom: laptop.rom,
      os: laptop.os,
    },
  });

  const onSubmit = async (values: UpdateDetailsFormData) => {
    const { serialNumber, ...updates } = values;
    if (!serialNumber) {
      console.error("serialNumber is required to update laptop");
      return;
    }
    const result = await updateLaptop(serialNumber, updates);
    if (result.success) {
      form.reset();
      setOpen(false);
      toast.success(result.message || "laptop updated successfully!");
    } else {
      toast.error(result.error || "Failed to update laptop");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loading && <LoadingOverlay />}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950 flex items-center gap-1.5"
        >
          <Pencil size={14} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <Pencil className="h-5 w-5 text-emerald-600" />
            Update Laptop Details
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Modify the laptop information below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <div className="space-y-5">
              {/* System Name - Full Width */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="systemName"
                label="System Name"
                placeholder="LNKLOP12633"
              />

              {/* Brand and Model - Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="brand"
                  label="Brand"
                  placeholder="HP"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="model"
                  label="Model"
                  placeholder="EliteBook 840"
                />
              </div>

              {/* Serial Number - Full Width (Disabled for updates) */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="serialNumber"
                label="Serial Number"
                placeholder="SN12345678"
                disabled={true}
              />

              {/* RAM and ROM - Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="ram"
                  label="RAM"
                  placeholder="8GB"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="rom"
                  label="Storage (ROM)"
                  placeholder="256GB"
                />
              </div>

              <div>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="os"
                  label="Operating System"
                  placeholder="Windows 10"
                />
              </div>
            </div>
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
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Update Laptop
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateForm;
