import CustomFormField from "@/components/CustomFormField";
import TagsInput from "@/components/tagInput";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useBrandStore from "@/store/useBrandStore";
import {
  brandModelSchema,
  FormFieldType,
  type BrandModelFormData,
} from "@/validation/laptopDetailsvalidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateBrand = () => {
  const [open, setOpen] = useState(false);
  const { createBrand } = useBrandStore();

  const form = useForm<BrandModelFormData>({
    resolver: zodResolver(brandModelSchema),
    defaultValues: {
      brandName: "",
      models: [],
    },
  });

  const onSubmit = async (values: BrandModelFormData) => {
    const result = await createBrand(values.brandName, values.models);
    if (result.success) {
      form.reset();
      setOpen(false);
      toast.success(result.message || "Brand created successfully!");
    } else {
      toast.error(result.error || "Failed to create brand");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-indigo-600 hover:bg-indigo-700 rounded-[50px] cursor-pointer text-white px-4 py-2">
        Add Brand
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new brand.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="brandName"
                label="Brand Name"
                placeholder="Enter brand name"
              />

              <FormField
                control={form.control}
                name="models"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Models</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Add model and press Enter"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
              Save Brand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrand;
