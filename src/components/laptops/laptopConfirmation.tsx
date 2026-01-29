import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface LaptopActionConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  laptopActionType: "decommission" | "return";
  systemName: string | null;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  retirementNote?: string;
  onRetirementNoteChange?: (note: string) => void;
}

export function LaptopActionConfirmationDialog({
  open,
  onOpenChange,
  laptopActionType,
  systemName,
  onConfirm,
  isLoading,
  retirementNote,
  onRetirementNoteChange,
}: LaptopActionConfirmationDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      onOpenChange(open);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {laptopActionType === "decommission"
              ? `This will permanently decommission the laptop "${systemName}". This action cannot be undone.`
              : `This will return the laptop "${systemName}". This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {laptopActionType === "decommission" && onRetirementNoteChange && (
          <div className="space-y-2">
            <label
              htmlFor="retirement-note"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Retirement Note (Optional)
            </label>
            <Textarea
              id="retirement-note"
              placeholder="Enter reason for retiring this laptop..."
              value={retirementNote || ""}
              onChange={(e) => onRetirementNoteChange(e.target.value)}
              disabled={isLoading}
              className="min-h-[100px] resize-none"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {laptopActionType === "decommission" ? "Decommission" : "Return"}
            {isLoading ? "..." : ""}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
