import {
  CheckCircle,
  XCircle,
  Wrench,
  Clock,
  AlertTriangle,
} from "lucide-react";
import clsx from "clsx";

interface LaptopStatusBadgeProps {
  status:
    | "Available"
    | "In Use"
    | "Retired"
    | "In Repair"
    | "Fully Depreciated";
}

export function LaptopStatusBadge({ status }: LaptopStatusBadgeProps) {
  const statusStyles = {
    Available: {
      icon: CheckCircle,
      bg: "bg-green-100 dark:bg-green-900/40",
      text: "text-green-700 dark:text-green-400",
    },
    "In Use": {
      icon: Clock,
      bg: "bg-blue-100 dark:bg-blue-900/40",
      text: "text-blue-700 dark:text-blue-400",
    },
    Retired: {
      icon: XCircle,
      bg: "bg-gray-100 dark:bg-gray-800/60",
      text: "text-gray-700 dark:text-gray-400",
    },
    "In Repair": {
      icon: Wrench,
      bg: "bg-yellow-100 dark:bg-yellow-900/40",
      text: "text-yellow-700 dark:text-yellow-400",
    },
    "Fully Depreciated": {
      icon: AlertTriangle,
      bg: "bg-red-100 dark:bg-red-900/40",
      text: "text-red-700 dark:text-red-400",
    },
  };

  const {
    icon: Icon,
    bg,
    text,
  } = statusStyles[status] || statusStyles["Available"];

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
        bg,
        text
      )}
    >
      <Icon size={14} />
      {status}
    </div>
  );
}
