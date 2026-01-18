import {
  addLaptopSchema,
  FormFieldType,
  type addLaptopFormData,
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
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { useLaptopStore } from "@/store/useLaptopStore";
import { toast } from "react-toastify";
import {
  brandOptions,
  osOptions,
  ramOptions,
  romOptions,
} from "@/constants/constants";


const AddForm = () => {
  const { addLaptop, loading } = useLaptopStore();
  const [open, setOpen] = useState(false);

  const form = useForm<addLaptopFormData>({
    resolver: zodResolver(addLaptopSchema),
    defaultValues: {
      systemName: "",
      brand: "",
      model: "",
      serialNumber: "",
      ram: "",
      rom: "",
      os: "",
    },
  });

  const onSubmit = async (values: addLaptopFormData) => {
    const result = await addLaptop(values);
    if (result.success) {
      form.reset();
      setOpen(false);
      toast.success(result.message || "laptop added successfully!");
    } else {
      toast.error(result.error || "Failed to add laptop");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loading && <LoadingOverlay />}
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-[50px] cursor-pointer text-white">
          Add Laptop
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold">
            Add New Laptop
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Fill in the required laptop details below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <div className="space-y-5">
              {/* System Name - Full Width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="systemName"
                  label="System Name"
                  placeholder="LNKLOP12633"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="serialNumber"
                  label="Serial Number"
                  placeholder="SN12345678"
                />
              </div>

              {/* Brand and Model - Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="brand"
                  label="Brand"
                  placeholder="Select Brand"
                  options={brandOptions}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="model"
                  label="Model"
                  placeholder="EliteBook 840"
                />
              </div>

              {/* Serial Number - Full Width */}

              {/* RAM and ROM - Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="ram"
                  label="RAM"
                  placeholder="Select RAM"
                  options={ramOptions}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="rom"
                  label="Storage (ROM)"
                  placeholder="Select Storage"
                  options={romOptions}
                />
              </div>

              <div>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="os"
                  label="Operating System"
                  placeholder="Select OS"
                  options={osOptions}
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
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save Laptop
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddForm;
