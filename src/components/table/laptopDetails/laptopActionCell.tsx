import { Button } from "@/components/ui/button";
import { IterationCw, Trash2 } from "lucide-react";
import UpdateForm from "@/components/form/laptopdetails/UpdateForm";
import type { LaptopDetails } from "@/types/types";
import { useLaptopStore } from "@/store/useLaptopStore";
import LaptopDetailsModal from "@/components/laptops/laptopDetailsModal";
import AssignForm from "@/components/form/assignment/AssignForm";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { LaptopActionConfirmationDialog } from "@/components/laptops/laptopConfirmation";
import { useState } from "react";
import { toast } from "react-toastify";

interface LaptopActionsCellProps {
  laptop: LaptopDetails;
}

export function LaptopActionsCell({ laptop }: LaptopActionsCellProps) {
  const { retireLaptop, loading } = useLaptopStore();
  const { returnCurrentUser, loading: returnLoading } = useAssignmentStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"retire" | "return">("retire");
  const [retirementNote, setRetirementNote] = useState("");

  const handleRetireClick = () => {
    setActionType("retire");
    setRetirementNote("");
    setDialogOpen(true);
  };

  const handleReturnClick = () => {
    setActionType("return");
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      if (actionType === "retire") {
        await retireLaptop(laptop.serialNumber, retirementNote);
        toast.success(`${laptop.systemName} has been retired successfully.`);
      } else {
        const id = laptop._id;
        if (!id) {
          toast.error("Missing laptop ID");
          return;
        }
        await returnCurrentUser(id);
        toast.success(`${laptop.systemName} has been returned successfully.`);
      }
      setDialogOpen(false);
      setRetirementNote("");
    } catch (error) {
      console.error(`Failed to ${actionType} laptop`, error);
      toast.error(`Failed to ${actionType} laptop. Please try again.`);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {laptop.status === "retired" ? null : (
          <UpdateForm serialNumber={laptop.serialNumber} />
        )}

        {laptop.status === "retired" ? null : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetireClick}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={14} />
          </Button>
        )}

        <LaptopDetailsModal serialNumber={laptop.serialNumber} />

        {laptop.status === "available" || laptop.status === "returned" ? (
          <AssignForm id={laptop._id} />
        ) : null}

        {laptop.status === "assigned" ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleReturnClick}
            className="flex items-center gap-1 cursor-pointer"
          >
            <IterationCw /> Return
          </Button>
        ) : null}
      </div>

      <LaptopActionConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        laptopActionType={actionType}
        systemName={laptop.systemName}
        onConfirm={handleConfirm}
        isLoading={actionType === "retire" ? loading : returnLoading}
        retirementNote={retirementNote}
        onRetirementNoteChange={setRetirementNote}
      />
    </>
  );
}
