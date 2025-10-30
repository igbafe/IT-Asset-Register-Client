import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import clsx from "clsx";

interface AssignmentStatusBadgeProps {
  status: "Active" | "Returned" | "Retired";
  size?: "sm" | "md" | "lg";
}

export function AssignmentStatusBadge({ status, size = "md" }: AssignmentStatusBadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };

  const statusStyles = {
    Active: {
      icon: CheckCircle,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border border-emerald-200 dark:border-emerald-800",
      glow: "shadow-sm shadow-emerald-100 dark:shadow-emerald-900/20"
    },
    Retired: {
      icon: XCircle,
      bg: "bg-slate-50 dark:bg-slate-900/40",
      text: "text-slate-700 dark:text-slate-300",
      border: "border border-slate-200 dark:border-slate-700",
      glow: "shadow-sm shadow-slate-100 dark:shadow-slate-800/20"
    },
    Returned: {
      icon: RefreshCw,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-300",
      border: "border border-amber-200 dark:border-amber-800",
      glow: "shadow-sm shadow-amber-100 dark:shadow-amber-900/20"
    },
  };

  const {
    icon: Icon,
    bg,
    text,
    border,
    glow
  } = statusStyles[status] || statusStyles["Active"];

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200",
        "hover:scale-105 hover:shadow-md",
        bg,
        text,
        border,
        glow,
        sizeStyles[size]
      )}
    >
      <Icon 
        size={size === "sm" ? 12 : size === "md" ? 14 : 16} 
        className="flex-shrink-0"
      />
      <span className="whitespace-nowrap font-semibold tracking-wide">
        {status}
      </span>
    </div>
  );
}