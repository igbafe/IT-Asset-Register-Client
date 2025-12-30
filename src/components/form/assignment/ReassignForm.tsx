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
import { useEffect, useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import {
  reassignLaptopSchema,
  type ReassignLaptopFormData,
} from "@/validation/assignmentValidation";
import { toast } from "react-toastify";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useLaptopStore } from "@/store/useLaptopStore";

type ReassignFormProps = {
  systemName: string;
  serialNumber: string;
};

const ReassignForm = ({ systemName, serialNumber }: ReassignFormProps) => {
  const { reassignLaptop, loading } = useAssignmentStore();
  const { laptops, fetchLaptops } = useLaptopStore();
  const [open, setOpen] = useState(false);

  const form = useForm<ReassignLaptopFormData>({
    resolver: zodResolver(
      reassignLaptopSchema
    ) as unknown as Resolver<ReassignLaptopFormData>,
    defaultValues: {
      fullName: "",
      email: "",
      department: "",
    },
  });

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  const onSubmit = async (values: ReassignLaptopFormData) => {
    try {
      const laptop = laptops.find((lap) => lap.serialNumber === serialNumber);
      if (!laptop?._id) {
        console.error("Laptop _id not found");
        return;
      }
      const result = await reassignLaptop(laptop._id, values);
      if (result.success) {
        form.reset();
        setOpen(false);
        toast.success(result.message || "Registration successful!");
      }
    } catch (error) {
      console.error("Reassign failed", error);
      toast.error("Failed to reassign laptop");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loading && <LoadingOverlay />}
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Reassign Laptop
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold">
            Reassign Laptop
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Provide reassignment details for {systemName} ({serialNumber}).
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

              {/* Department - Full Width */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="department"
                label="Department"
                placeholder="IT"
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
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Saving..." : "Reassign Laptop"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReassignForm;
