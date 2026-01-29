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
  const decommissionedCount =
    laptops?.filter((l) => l.status === "decommissioned").length || 0;
  const availableCount =
    laptops?.filter((l) => l.status === "available").length || 0;
  const totalLaptops = laptops?.length || 0;

  const allActivities = getRecentActivities();
  const recentActivities = allActivities.slice(0, 5);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        {/* Main content area with fixed positioning context */}
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
              {/* Header */}
              <header className="flex items-center justify-between mb-6">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Welcome back! Here's your laptop overview
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-4 items-center flex-shrink-0 ml-4">
                  <SidebarTrigger />
                  <UserAvatar />
                </div>
              </header>

              {/* Content with consistent spacing */}
              <div className="space-y-6">
                <DashboardStats
                  totalLaptops={totalLaptops}
                  assignedCount={assignedCount}
                  availableCount={availableCount}
                  decommissionedCount={decommissionedCount}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <RecentActivitySection recentActivities={recentActivities} />
                  <QuickStatsCard
                    assignedCount={assignedCount}
                    availableCount={availableCount}
                    decommissionedCount={decommissionedCount}
                    totalLaptops={totalLaptops}
                  />
                </div>

                <RecentAssignmentsTable recentActivities={recentActivities} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
