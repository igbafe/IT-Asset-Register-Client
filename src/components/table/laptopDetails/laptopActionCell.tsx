import { useLaptopDetailsStore } from "@/store/laptopDetailsStore";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import UpdateForm from "@/components/form/laptopdetails/UpdateForm";

interface LaptopActionsCellProps {
  laptop: {
    systemName: string;
    brand: string;
    model: string;
    serialNumber: string;
    ram: string;
    rom: string;
    os: string;
    status?:
      | "Available"
      | "In Use"
      | "Retired"
      | "In Repair"
      | "Fully Depreciated";
  };
}

export function LaptopActionsCell({ laptop }: LaptopActionsCellProps) {
  const { retireLaptop } = useLaptopDetailsStore();

  const handleRetire = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to retire ${laptop.systemName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, retire it!",
    });

    if (!result.isConfirmed) return;

    try {
      await retireLaptop(laptop.serialNumber);
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
