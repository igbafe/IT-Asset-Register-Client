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
  updateCurrentUserSchema,
  type UpdateCurrentUserFormData,
} from "@/validation/assignmentValidation";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/LoadingOverlay";
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useLaptopStore } from "@/store/useLaptopStore";
import { toast } from "react-toastify";
import { departmentOptions } from "@/constants/constants";

const UpdateAssignmentForm = (LaptopId: string) => {
  const { updateCurrentUser, loading } = useAssignmentStore();
  const { fetchLaptops } = useLaptopStore();
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateCurrentUserFormData>({
    resolver: zodResolver(
      updateCurrentUserSchema
    ) as unknown as Resolver<UpdateCurrentUserFormData>,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    },
  });

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  // use the correct typed form data and call assignLaptop
  const onSubmit = async (values: UpdateCurrentUserFormData) => {
    try {
      // Remove empty string values
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([, value]) => value !== "")
      );

      // Check if at least one field has a value
      if (Object.keys(filteredValues).length === 0) {
        toast.error("Please fill in at least one field");
        return;
      }

      const result = await updateCurrentUser(LaptopId, filteredValues);
      if (result.success) {
        form.reset();
        setOpen(false);
        toast.success(result.message || "Registration successful!");
      }
    } catch (error) {
      console.error("Update assignment failed", error);
      toast.error("Failed to update assignment:");
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold">
            Update Assignment
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Modify the assignment information below.
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
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="department"
                  label="Department"
                  placeholder="Select Department"
                  options={departmentOptions}
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

export default UpdateAssignmentForm;
