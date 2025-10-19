import { useLaptopDetailsStore } from "@/store/laptopDetailsStore";
import {
  FormFieldType,
  laptopDetailsSchema,
  type LaptopDetailsFormData,
} from "@/validation/validation";
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
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import CustomFormField from "../CustomFormField";
import LoadingOverlay from "../LoadingOverlay";
import { SelectItem } from "../ui/select";

const AddForm = () => {
  const { addLaptop, loading } = useLaptopDetailsStore();

  const form = useForm<LaptopDetailsFormData>({
    resolver: zodResolver(laptopDetailsSchema),
    defaultValues: {
      systemName: "",
      brand: "",
      model: "",
      serialNumber: "",
      ram: "",
      rom: "",
      os: "",
      status: "Available",
    },
  });

  const onSubmit = async (values: LaptopDetailsFormData) => {
    const result = await addLaptop(values);
    if (result.success) {
      form.reset();
    }
  };

  return (
    <Dialog>
      {loading && <LoadingOverlay />}
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
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

              {/* Serial Number - Full Width */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="serialNumber"
                label="Serial Number"
                placeholder="SN12345678"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="os"
                  label="Operating System"
                  placeholder="Windows 10"
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="status"
                  label="Status"
                  placeholder="Select Status"
                >
                  <SelectItem
                    value="Available"
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Available
                  </SelectItem>
                  <SelectItem
                    value="In Use"
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    In Use
                  </SelectItem>
                  <SelectItem
                    value="Retired"
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Retired
                  </SelectItem>
                  <SelectItem
                    value="In Repair"
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    In Repair
                  </SelectItem>
                  <SelectItem
                    value="Fully Depreciated"
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Fully Depreciated
                  </SelectItem>
                </CustomFormField>
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
