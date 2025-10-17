"use client";

import { useLaptopDetailsStore } from "@/store/laptopDetailsStore";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

interface LaptopActionsCellProps {
  serialNumber: string;
  systemName: string;
}

export function LaptopActionsCell({
  serialNumber,
  systemName,
}: LaptopActionsCellProps) {
  const { retireLaptop } = useLaptopDetailsStore();

  const handleRetire = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to retire ${systemName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, retire it!",
    });

    if (!result.isConfirmed) return;

    try {
      await retireLaptop(serialNumber);
    } catch {
      console.log("Failed to retire laptop");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Edit Button */}

      {/* Retire Button */}
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
