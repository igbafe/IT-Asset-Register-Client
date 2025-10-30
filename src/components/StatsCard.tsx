import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
  type: "total" | "assigned" | "available" | "retired";
  count: number;
  label: string;
  Icon: LucideIcon;
}

const StatsCard = ({ count, label, type, Icon }: StatCardProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col justify-between rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md",
        "w-full"
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={clsx("p-3 rounded-lg", {
            "bg-blue-100 dark:bg-blue-950": type === "total",
            "bg-green-100 dark:bg-green-950": type === "assigned",
            "bg-purple-100 dark:bg-purple-950": type === "available",
            "bg-gray-100 dark:bg-gray-800": type === "retired",
          })}
        >
          <Icon
            className={clsx("h-6 w-6", {
              "text-blue-600 dark:text-blue-400": type === "total",
              "text-green-600 dark:text-green-400": type === "assigned",
              "text-purple-600 dark:text-purple-400": type === "available",
              "text-gray-600 dark:text-gray-400": type === "retired",
            })}
          />
        </div>
        <h2 className="text-3xl font-bold text-foreground">{count}</h2>
      </div>
      <p className="text-sm font-medium mt-3 text-muted-foreground">{label}</p>
    </div>
  );
};

export default StatsCard;