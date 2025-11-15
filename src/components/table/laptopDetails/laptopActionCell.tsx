import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import UpdateForm from "@/components/form/laptopdetails/UpdateForm";
import type { LaptopDetails } from "@/types/types";
import { useLaptopStore } from "@/store/useLaptopStore";

interface LaptopActionsCellProps {
  laptop: LaptopDetails;
}

export function LaptopActionsCell({ laptop }: LaptopActionsCellProps) {
  const { retireLaptop } = useLaptopStore();

  const handleRetire = async () => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to retire ${laptop.systemName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, retire it!",
    });

    if (!confirmResult.isConfirmed) return;

    // Ask for optional retirement note
    const noteResult = await Swal.fire({
      title: "Retirement Note (Optional)",
      text: "You can add a reason for retiring this laptop:",
      input: "textarea",
      inputPlaceholder: "Enter note here...",
      inputAttributes: {
        "aria-label": "Retirement note",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
    });

    if (noteResult.isDismissed) return;

    const retirementNote = noteResult.value || ""; // optional

    try {
      await retireLaptop(laptop.serialNumber, retirementNote);
    } catch {
      console.log("Failed to retire laptop");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <UpdateForm laptop={laptop} />

      <Button
        variant="destructive"
        size="sm"
        onClick={handleRetire}
        className="flex items-center gap-1"
      >
        <Trash2 size={14} /> Retire
      </Button>
    </div>
  );
}
