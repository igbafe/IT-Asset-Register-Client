import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import {
  CheckCircle,
  ClipboardCheck,
  Laptop,
  XCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useLaptopDetailsStore } from "@/store/laptopDetailsStore";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/Avatar";

export default function LaptopDashboard() {
  const { laptops, fetchLaptops } = useLaptopDetailsStore();
  const { assignments, fetchAssignments } = useAssignmentStore();

  useEffect(() => {
    fetchLaptops();
    fetchAssignments();
  }, [fetchLaptops, fetchAssignments]);

  const assignedCount =
    assignments?.filter((a) => a.status === "Active").length || 0;
  const retiredCount =
    assignments?.filter((a) => a.status === "Retired").length || 0;
  const availableCount =
    laptops?.filter((laptop) => laptop.status === "Available").length || 0;
  const totalLaptops = laptops?.length || 0;

  // Sort recent assignments (newest first)
  const recentAssignments = [...assignments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Get time ago helper
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return past.toLocaleDateString();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
      case "Retired":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto  w-full hide-scrollbar">
          <div>
            <div className="p-6 max-w-7xl mx-auto space-y-6">
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
                  count={retiredCount}
                  label="Retired Laptops"
                  Icon={XCircle}
                />
              </section>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity - Takes 2 columns */}
                <section className="lg:col-span-2">
                  <div className="bg-card rounded-lg border shadow-sm h-full">
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-foreground">
                              Recent Activity
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Latest laptop assignments
                            </p>
                          </div>
                        </div>
                        <Link
                          to="/assignments"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          View All <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    <div className="p-6">
                      {recentAssignments.length > 0 ? (
                        <div className="space-y-4">
                          {recentAssignments.map((a) => (
                            <div
                              key={a._id}
                              className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <div className="p-2 bg-background rounded-lg mt-1 border">
                                <Laptop className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <p className="font-semibold text-foreground truncate">
                                    {a.fullName}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className={getStatusColor(a.status)}
                                  >
                                    {a.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Assigned laptop{" "}
                                  <span className="font-mono font-medium text-foreground">
                                    {a.serialNumber}
                                  </span>
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs text-muted-foreground">
                                  {getTimeAgo(a.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                          <p className="text-muted-foreground">
                            No recent activity yet.
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Start assigning laptops to see activity here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Quick Stats Card - Takes 1 column */}
                <section>
                  <div className="bg-card rounded-lg border shadow-sm p-6 h-full">
                    <h3 className="font-semibold text-foreground mb-6">
                      Quick Stats
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Utilization Rate
                          </span>
                          <span className="font-semibold text-foreground">
                            {totalLaptops > 0
                              ? Math.round((assignedCount / totalLaptops) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                totalLaptops > 0
                                  ? (assignedCount / totalLaptops) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                          <span className="text-sm font-medium text-foreground">
                            Active Assignments
                          </span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {assignedCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                          <span className="text-sm font-medium text-foreground">
                            Available
                          </span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {availableCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <span className="text-sm font-medium text-foreground">
                            Retired
                          </span>
                          <span className="font-bold text-gray-600 dark:text-gray-400">
                            {retiredCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Assignment Table Preview */}
              <section>
                <div className="bg-card rounded-lg border shadow-sm">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">
                          Recent Assignments
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Latest laptop assignments overview
                        </p>
                      </div>
                      <Link
                        to="/assignments"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View All <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="py-3 px-6 text-left font-medium text-muted-foreground">
                            Serial Number
                          </th>
                          <th className="py-3 px-6 text-left font-medium text-muted-foreground">
                            Employee
                          </th>
                          <th className="py-3 px-6 text-left font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="py-3 px-6 text-left font-medium text-muted-foreground">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {recentAssignments.map((a) => (
                          <tr
                            key={a._id}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <span className="font-mono text-foreground font-medium">
                                {a.serialNumber}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-medium text-foreground">
                              {a.fullName}
                            </td>
                            <td className="py-4 px-6">
                              <Badge
                                variant="outline"
                                className={getStatusColor(a.status)}
                              >
                                {a.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-6 text-muted-foreground">
                              {new Date(a.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {recentAssignments.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-12 text-center">
                              <ClipboardCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                              <p className="text-muted-foreground">
                                No assignments found.
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Create your first assignment to get started
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
