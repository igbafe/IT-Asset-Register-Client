import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AssignmentDetails } from "@/types/types";

interface AssignmentCardProps {
  assignment: AssignmentDetails;
}

// Active Assignment Card Component
export function ActiveAssignmentCard({ assignment }: AssignmentCardProps) {
  const user = assignment.currentUser;
  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-300 dark:border-green-700 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.fullName}
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white mt-1">
                ● Active Assignment
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                Department
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {user.department}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                Assigned Since
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {format(new Date(user.assignedDate), "MMMM dd, yyyy")}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                System Name
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {assignment.systemName}
              </p>
            </div>

            {user.email && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Previous Assignments Table Component
export function PreviousAssignmentsTable({ assignment }: AssignmentCardProps) {
  const previousUsers = assignment.previousUser || [];
  if (previousUsers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          No previous assignments
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="font-semibold">Assigned To</TableHead>
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="font-semibold">Assigned Date</TableHead>
            <TableHead className="font-semibold">Returned Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {previousUsers.map((assignment) => (
            <TableRow
              key={assignment.email + assignment.assignedDate}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell className="font-medium">
                {assignment.fullName}
              </TableCell>
              <TableCell>{assignment.department}</TableCell>
              <TableCell>
                {format(new Date(assignment.assignedDate), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                {assignment.returnedDate
                  ? format(new Date(assignment.returnedDate), "MMM dd, yyyy")
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
