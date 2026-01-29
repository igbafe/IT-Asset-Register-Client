import { CheckCircle, XCircle, Wrench, Clock } from "lucide-react";
import clsx from "clsx";
import { LaptopStatus } from "@/types/types";

interface LaptopStatusBadgeProps {
  status: LaptopStatus;
}

export function LaptopStatusBadge({ status }: LaptopStatusBadgeProps) {
  const statusStyles: Record<
    LaptopStatus,
    {
      label: string;
      icon: React.ComponentType<{ size?: number }>;
      bg: string;
      text: string;
    }
  > = {
    available: {
      label: "Available",
      icon: CheckCircle,
      bg: "bg-green-100 dark:bg-green-900/40",
      text: "text-green-700 dark:text-green-400",
    },
    assigned: {
      label: "Assigned",
      icon: Clock,
      bg: "bg-blue-100 dark:bg-blue-900/40",
      text: "text-blue-700 dark:text-blue-400",
    },
    returned: {
      label: "Returned",
      icon: Wrench,
      bg: "bg-yellow-100 dark:bg-yellow-900/40",
      text: "text-yellow-700 dark:text-yellow-400",
    },
    decommissioned: {
      label: "Decommissioned",
      icon: XCircle,
      bg: "bg-gray-100 dark:bg-gray-800/60",
      text: "text-gray-700 dark:text-gray-400",
    },
  };

  const { label, icon: Icon, bg, text } = statusStyles[status];

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
        bg,
        text
      )}
    >
      <Icon size={14} />
      {label}
    </div>
  );
}
