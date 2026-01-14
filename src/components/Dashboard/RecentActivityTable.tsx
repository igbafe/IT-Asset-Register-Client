import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

interface RecentAssignmentsTableProps {
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

export default function RecentAssignmentsTable({
  recentActivities,
}: RecentAssignmentsTableProps) {
  return (
    <section>
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Recent Assignments
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Latest laptop assignment activities
              </p>
            </div>
            <Link
              to="/inventory"
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
                  Department
                </th>
                <th className="py-3 px-6 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="py-3 px-6 text-left font-medium text-muted-foreground">
                  Assigned Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentActivities.map((activity) => (
                <tr
                  key={activity._id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <span className="font-mono text-foreground font-medium">
                      {activity.serialNumber}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-foreground">
                    {activity.firstName} {activity.lastName}
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {activity.department}
                  </td>
                  <td className="py-4 px-6">
                    <Badge
                      variant="outline"
                      className={getStatusColor(activity.status)}
                    >
                      {activity.status === "current" ? "Current" : "Previous"}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {new Date(activity.assignedDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentActivities.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
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
  );
}
