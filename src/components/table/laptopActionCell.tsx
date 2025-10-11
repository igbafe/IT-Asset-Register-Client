import { useLaptopDetailsStore } from "@/store/laptopDetailsStore";
import Swal from "sweetalert2";

interface LaptopActionsCellProps {
  serialNumber: string;
  systemName: string;
}

export function LaptopActionsCell({ serialNumber, systemName }: LaptopActionsCellProps) {
  const { retireLaptop } = useLaptopDetailsStore();

  const handleRetire = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to retire ${systemName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, retire it",
    });

    if (confirm.isConfirmed) {
      await retireLaptop(serialNumber);
    }
  };

  return (
    <button
      onClick={handleRetire}
      className="text-red-600 hover:text-red-800 underline"
    >
      Retire
    </button>
  );
}
