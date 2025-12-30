import { FormFieldType } from "@/validation/laptopDetailsvalidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
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
import {
  LaptopUserSchema,
  type LaptopUserFormData,
} from "@/validation/assignmentValidation";
import { useEffect, useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useLaptopStore } from "@/store/useLaptopStore";
import { SelectItem } from "@/components/ui/select";
import { LaptopStatus } from "@/types/types";
import { toast } from "react-toastify";

const AssignForm = () => {
  const { assignLaptop, loading } = useAssignmentStore();
  const { laptops, fetchLaptops } = useLaptopStore();
  const [open, setOpen] = useState(false);

  const form = useForm<LaptopUserFormData>({
    resolver: zodResolver(
      LaptopUserSchema
    ) as unknown as Resolver<LaptopUserFormData>,
    defaultValues: {
      fullName: "",
      email: "",
      department: "",
    },
  });

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  const onSubmit = async (values: LaptopUserFormData) => {
    const selectedLaptop = laptops.find((lap) => lap._id === values.laptopId);

    if (!selectedLaptop?._id) {
      console.error("Laptop not found or missing _id");
      return;
    }

    console.log("Assigning laptop:", selectedLaptop.systemName);

    // Call assignLaptop with _id + values
    const result = await assignLaptop(selectedLaptop._id, values);

    if (result.success) {
      form.reset();
      setOpen(false);
      toast.success(result.message || "Assignment successful!");
    } else {
      toast.error(result.error || "Assignment failed");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loading && <LoadingOverlay />}
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Assign Laptop
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
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
              {/* Full Name & Email - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="fullName"
                  label="Full Name"
                  placeholder="John Doe"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Department & Serial Number - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="laptopId"
                  label="Laptop Info"
                  placeholder="Select a laptop"
                >
                  {laptops
                    .filter(
                      (lap) =>
                        lap.status === LaptopStatus.AVAILABLE ||
                        lap.status === LaptopStatus.RETURNED
                    )
                    .map((lap) => (
                      <SelectItem key={lap._id} value={lap._id!}>
                        {lap.serialNumber} — {lap.systemName}
                      </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="department"
                  label="Department"
                  placeholder="IT"
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
              Save Assignment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignForm;
