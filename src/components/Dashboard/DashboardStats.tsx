import StatsCard from "@/components/StatsCard";
import {
  CheckCircle,
  ClipboardCheck,
  Laptop,
  XCircle,
} from "lucide-react";

interface DashboardStatsProps {
  totalLaptops: number;
  assignedCount: number;
  availableCount: number;
  decommissionedCount: number;
}

export default function DashboardStats({
  totalLaptops,
  assignedCount,
  availableCount,
  decommissionedCount,
}: DashboardStatsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatsCard
        type="total"
        count={totalLaptops}
        label="Total Laptops"
        Icon={Laptop}
      />
      <StatsCard
        type="assigned"
        count={assignedCount}
        label="Assigned Laptops"
        Icon={ClipboardCheck}
      />
      <StatsCard
        type="available"
        count={availableCount}
        label="Available Laptops"
        Icon={CheckCircle}
      />
      <StatsCard
        type="retired"
        count={decommissionedCount}
        label="Decommissioned Laptops"
        Icon={XCircle}
      />
    </section>
  );
}