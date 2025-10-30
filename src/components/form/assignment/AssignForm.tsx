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
import { useAssignmentStore } from "@/store/assignmentStore";
import {
  assignLaptopSchema,
  type AssignLaptopFormData,
} from "@/validation/assignmentValidation";
import { useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";

const AssignForm = () => {
  const { assignLaptop, loading } = useAssignmentStore();
  const [open, setOpen] = useState(false);

  const form = useForm<AssignLaptopFormData>({
    // cast resolver to the form's Resolver type to satisfy TS when preprocess is used
    resolver: zodResolver(
      assignLaptopSchema
    ) as unknown as Resolver<AssignLaptopFormData>,
    defaultValues: {
      systemName: "",
      fullName: "",
      email: "",
      department: "",
      serialNumber: "",
      assignedDate: new Date(),
    },
  });

  // use the correct typed form data and call assignLaptop
  const onSubmit = async (values: AssignLaptopFormData) => {
    const result = await assignLaptop(values);
    if (result?.success) {
      form.reset();
      setOpen(false);
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
              {/* System Name - Full Width */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="systemName"
                label="System Name"
                placeholder="LNKLOP12633"
              />

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
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="department"
                  label="Department"
                  placeholder="IT"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="serialNumber"
                  label="Serial Number"
                  placeholder="SN12345678"
                />
              </div>

              {/* Assigned Date - Full Width */}
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="assignedDate"
                label="Assigned Date"
                placeholder="Select assigned date"
              />
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
