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
import { toast } from "react-toastify";
import { useLaptopStore } from "@/store/useLaptopStore";
import { departmentOptions } from "@/constants/constants";
import { UserPlus } from "lucide-react";

type AssignFormProps = {
  id?: string;
};

const AssignForm = ({ id }: AssignFormProps) => {
  const { assignLaptop, loading } = useAssignmentStore();
  const { laptops, fetchLaptops } = useLaptopStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  const form = useForm<LaptopUserFormData>({
    resolver: zodResolver(
      LaptopUserSchema
    ) as unknown as Resolver<LaptopUserFormData>,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    },
  });

  const onSubmit = async (values: LaptopUserFormData) => {
    console.log("=== FORM SUBMIT TRIGGERED ===");
    console.log("Form values:", values);
    console.log("Serial number:", id);
    console.log("All laptops:", laptops);

    const laptop = laptops.find((lap) => lap._id === id);
    console.log("Found laptop:", laptop);

    if (!laptop?._id) {
      console.error("Laptop not found or missing _id");
      toast.error("Laptop not found. Please try again.");
      return;
    }

    console.log("Attempting to assign laptop with ID:", laptop._id);
    const result = await assignLaptop(laptop._id, values);
    console.log("Assignment result:", result);

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
        <Button className="flex items-center gap-2 bg-transparent text-black dark:text-white hover:text-white hover:bg-indigo-600 transition-colors duration-200 rounded-[50px] px-4 py-2 shadow-sm group">
          <UserPlus
            size={16}
            className="text-slate-400 group-hover:text-white transition-colors"
          />
          <span>Assign</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold">
            Assign Laptop
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Fill in the user details to assign this laptop.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1"
          >
            <div className="flex-1 overflow-y-auto px-6 py-4">
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="john.doe@example.com"
                  />
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
                  disabled={loading}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {loading ? "Assigning..." : "Save Assignment"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignForm;
