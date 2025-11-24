import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { UserAvatar } from "@/components/Avatar";
import { useLaptopStore } from "@/store/useLaptopStore";
import RecentAssignmentsTable from "@/components/Dashboard/RecentActivityTable";
import QuickStatsCard from "@/components/Dashboard/QuickStats";
import RecentActivitySection from "@/components/Dashboard/RecentActivity";
import { useEffect } from "react";
import DashboardStats from "@/components/Dashboard/DashboardStats";

export default function LaptopDashboard() {
  const { laptops, fetchLaptops, getRecentActivities } = useLaptopStore();

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  const assignedCount =
    laptops?.filter((l) => l.status === "assigned").length || 0;
  const retiredCount =
    laptops?.filter((l) => l.status === "retired").length || 0;
  const availableCount =
    laptops?.filter((l) => l.status === "available").length || 0;
  const totalLaptops = laptops?.length || 0;

  // Get all recent activities sorted by date
  const allActivities = getRecentActivities();

  // Get last 5 activities
  const recentActivities = allActivities.slice(0, 5);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col overflow-y-auto w-full hide-scrollbar">
          <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
            {/* Header */}
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back! Here's your laptop overview
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <SidebarTrigger />
                <UserAvatar />
              </div>
            </header>

            {/* Stats Section */}
            <DashboardStats
              totalLaptops={totalLaptops}
              assignedCount={assignedCount}
              availableCount={availableCount}
              retiredCount={retiredCount}
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentActivitySection recentActivities={recentActivities} />
              <QuickStatsCard
                assignedCount={assignedCount}
                availableCount={availableCount}
                retiredCount={retiredCount}
                totalLaptops={totalLaptops}
              />
            </div>

            {/* Recent Assignments Table */}
            <RecentAssignmentsTable recentActivities={recentActivities} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
