import { useLaptopStore } from "@/store/useLaptopStore";
import {
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
import { useEffect, useState, useMemo } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { toast } from "react-toastify";
import { FormFieldType, osOptions, ramOptions, romOptions } from "@/constants/constants";
import useBrandStore from "@/store/useBrandStore";

type UpdateFormProps = {
  serialNumber: string;
};

const UpdateForm = ({ serialNumber }: UpdateFormProps) => {
  const { loading, updateLaptop } = useLaptopStore();
  const { fetchBrands, brand } = useBrandStore();
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const form = useForm<UpdateDetailsFormData>({
    resolver: zodResolver(UpdateDetailsSchema),
    defaultValues: {
      systemName: "",
      brand: "",
      model: "",
      ram: "",
      rom: "",
      os: "",
    },
  });

  // Create brand options from the store
  const brandOptions = useMemo(() => {
    return brand.map((b) => ({
      value: b.brandName,
      label: b.brandName,
    }));
  }, [brand]);

  // Create model options based on selected brand
  const modelOptions = useMemo(() => {
    if (!selectedBrand) return [];
    const selectedBrandData = brand.find((b) => b.brandName === selectedBrand);
    return (
      selectedBrandData?.models.map((model) => ({
        value: model,
        label: model,
      })) || []
    );
  }, [selectedBrand, brand]);

  // Watch for brand changes
  const watchedBrand = form.watch("brand");

  useEffect(() => {
    if (watchedBrand !== selectedBrand) {
      setSelectedBrand(watchedBrand ?? "");
      // Reset model when brand changes
      if (form.getValues("model")) {
        form.setValue("model", "");
      }
    }
  }, [watchedBrand, selectedBrand, form]);

  useEffect(() => {
    if (!open) return;
    fetchBrands();
  }, [open]);

  const onSubmit = async (values: UpdateDetailsFormData) => {
    try {
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([, value]) => value !== ""),
      );
      // Check if at least one field has a value
      if (Object.keys(filteredValues).length === 0) {
        toast.error("Please fill in at least one field");
        return;
      }
      const result = await updateLaptop(serialNumber, filteredValues);
      if (result.success) {
        form.reset();
        setOpen(false);
        toast.success(result.message || "laptop updated successfully!");
      }
    } catch (error) {
      console.error("Update laptop failed", error);
      toast.error("An error occurred while updating the laptop.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loading && <LoadingOverlay />}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-emerald-600 hover:text-emerald-700 cursor-pointer hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950 flex items-center gap-1.5"
          title="Edit Laptop"
        >
          <Pencil size={14} />
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
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="brand"
                  label="Brand"
                  placeholder="Select Brand"
                  options={brandOptions}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="model"
                  label="Model"
                  placeholder="Select Model"
                  options={modelOptions}
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
