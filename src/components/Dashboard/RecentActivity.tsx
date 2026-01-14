import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight, Laptop as LaptopIcon } from "lucide-react";

interface RecentActivity {
  _id: string;
  serialNumber: string;
  firstName: string;
  lastName: string;
  department: string;
  status: "current" | "previous";
  assignedDate: Date;
  returnedDate?: Date;
  laptopStatus: string;
}

interface RecentActivitySectionProps {
  recentActivities: RecentActivity[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "current":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "previous":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
  }
};

const getTimeAgo = (date: string | Date) => {
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

export default function RecentActivitySection({
  recentActivities,
}: RecentActivitySectionProps) {
  return (
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
              to="/inventory"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-6">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="p-2 bg-background rounded-lg mt-1 border">
                    <LaptopIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-foreground capitalize truncate">
                        {activity.firstName} {activity.lastName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        ({activity.department})
                      </span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(activity.status)}
                      >
                        {activity.status === "current" ? "Current" : "Previous"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.status === "current"
                        ? "Currently assigned"
                        : "Previously assigned to"}{" "}
                      <span className="font-mono font-medium text-foreground">
                        {activity.serialNumber}
                      </span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {getTimeAgo(activity.assignedDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No recent activity yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start assigning laptops to see activity here
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
