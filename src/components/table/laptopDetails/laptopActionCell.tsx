import { Button } from "@/components/ui/button";
import { IterationCw, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import UpdateForm from "@/components/form/laptopdetails/UpdateForm";
import type { LaptopDetails } from "@/types/types";
import { useLaptopStore } from "@/store/useLaptopStore";
import LaptopDetailsModal from "@/components/laptops/laptopDetailsModal";
import AssignForm from "@/components/form/assignment/AssignForm";
import { useAssignmentStore } from "@/store/useAssignmentStore";

interface LaptopActionsCellProps {
  laptop: LaptopDetails;
}

export function LaptopActionsCell({ laptop }: LaptopActionsCellProps) {
  const { retireLaptop } = useLaptopStore();
  const { returnCurrentUser } = useAssignmentStore();

  // Custom SweetAlert styling based on your color scheme
  const getSwalStyles = (isDark: boolean) => ({
    popup: {
      background: isDark ? "#1a1f2e" : "#ffffff",
      color: isDark ? "#fafafa" : "#252525",
      borderRadius: "0.625rem",
    },
    title: {
      color: isDark ? "#fafafa" : "#252525",
    },
    htmlContainer: {
      color: isDark ? "#b4b4b4" : "#8e8e8e",
    },
    confirmButton: {
      backgroundColor: "#7c3aed",
      borderRadius: "0.625rem",
      padding: "0.5rem 1.5rem",
    },
    cancelButton: {
      backgroundColor: isDark ? "#444444" : "#f7f7f7",
      color: isDark ? "#fafafa" : "#343434",
      borderRadius: "0.625rem",
      padding: "0.5rem 1.5rem",
    },
    input: {
      backgroundColor: isDark ? "#444444" : "#f7f7f7",
      color: isDark ? "#fafafa" : "#252525",
      border: isDark
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid #ebebeb",
      borderRadius: "0.625rem",
    },
  });

  const handleRetire = async () => {
    const isDark = document.documentElement.classList.contains("dark");
    const swalStyles = getSwalStyles(isDark);

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to retire ${laptop.systemName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#444444",
      confirmButtonText: "Yes, retire it!",
      customClass: {
        popup: "swal-custom-popup",
        confirmButton: "swal-custom-confirm",
        cancelButton: "swal-custom-cancel",
      },
      background: swalStyles.popup.background,
      color: swalStyles.popup.color,
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
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#444444",
      customClass: {
        popup: "swal-custom-popup",
        confirmButton: "swal-custom-confirm",
        cancelButton: "swal-custom-cancel",
        input: "swal-custom-input",
      },
      background: swalStyles.popup.background,
      color: swalStyles.popup.color,
    });

    if (noteResult.isDismissed) return;

    const retirementNote = noteResult.value || ""; // optional

    try {
      await retireLaptop(laptop.serialNumber, retirementNote);
    } catch {
      console.log("Failed to retire laptop");
    }
  };

  const handleReturn = async () => {
    const isDark = document.documentElement.classList.contains("dark");
    const swalStyles = getSwalStyles(isDark);

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to return ${laptop.systemName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#444444",
      confirmButtonText: "Yes, return it!",
      customClass: {
        popup: "swal-custom-popup",
        confirmButton: "swal-custom-confirm",
        cancelButton: "swal-custom-cancel",
      },
      background: swalStyles.popup.background,
      color: swalStyles.popup.color,
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    const id = laptop._id; // Get the id
    if (!id) {
      await Swal.fire({
        title: "Error",
        text: "Missing laptop ID",
        icon: "error",
        confirmButtonColor: "#7c3aed",
        background: swalStyles.popup.background,
        color: swalStyles.popup.color,
      });
      return;
    }

    try {
      await returnCurrentUser(id); // Call with the valid ID
      await Swal.fire({
        title: "Success",
        text: `${laptop.systemName} has been returned.`,
        icon: "success",
        confirmButtonColor: "#7c3aed",
        background: swalStyles.popup.background,
        color: swalStyles.popup.color,
      });
    } catch (error) {
      console.log("Failed to return laptop", error);
    }
  };

  return (
    <>
      <style>{`
        .swal-custom-popup {
          border-radius: 0.625rem !important;
        }
        .swal-custom-confirm {
          border-radius: 0.625rem !important;
          padding: 0.5rem 1.5rem !important;
          font-weight: 500 !important;
        }
        .swal-custom-cancel {
          border-radius: 0.625rem !important;
          padding: 0.5rem 1.5rem !important;
          font-weight: 500 !important;
        }
        .swal-custom-input {
          border-radius: 0.625rem !important;
        }
        .swal2-styled.swal2-confirm:focus,
        .swal2-styled.swal2-cancel:focus {
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.3) !important;
        }
      `}</style>

      <div className="flex items-center gap-3">
        <UpdateForm serialNumber={laptop.serialNumber} />

        {laptop.status === "retired" ? null : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetire}
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
            onClick={handleReturn}
            className="flex items-center gap-1 cursor-pointer"
          >
           <IterationCw /> Return
          </Button>
        ) : null}
      </div>
    </>
  );
}
