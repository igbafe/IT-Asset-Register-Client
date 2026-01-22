import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TagsInput from "@/components/tagInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  addModelSchema,
  type AddModelFormData,
} from "@/validation/laptopDetailsvalidation";

interface AddModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string | null;
  onAddModel: (models: string[]) => Promise<void>;
}

export function AddModelDialog({
  open,
  onOpenChange,
  brandName,
  onAddModel,
}: AddModelDialogProps) {
  const form = useForm<AddModelFormData>({
    resolver: zodResolver(addModelSchema),
    defaultValues: {
      models: [],
    },
  });

  const onSubmit = async (values: AddModelFormData) => {
    await onAddModel(values.models);
    form.reset();
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Models to {brandName}</DialogTitle>
          <DialogDescription>
            Add one or more models to this brand. Press Enter after typing each
            model name.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Adding..." : "Add Models"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
