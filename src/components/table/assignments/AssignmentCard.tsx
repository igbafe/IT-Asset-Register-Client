import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Assignment } from "@/store/assignmentStore";

interface AssignmentCardProps {
  assignment: Assignment;
  onReassign: () => void;
}

// Active Assignment Card Component
export function ActiveAssignmentCard({ assignment }: AssignmentCardProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-300 dark:border-green-700 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {assignment.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {assignment.fullName}
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
                {assignment.department}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                Assigned Since
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {format(new Date(assignment.assignedDate), "MMMM dd, yyyy")}
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

            {assignment.email && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {assignment.email}
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
export function PreviousAssignmentsTable({
  assignments,
}: {
  assignments: Assignment[];
}) {
  if (assignments.length === 0) {
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
            <TableHead className="font-semibold">System Name</TableHead>
            <TableHead className="font-semibold">Assigned Date</TableHead>
            <TableHead className="font-semibold">Returned Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow
              key={assignment._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <TableCell className="font-medium">
                {assignment.fullName}
              </TableCell>
              <TableCell>{assignment.department}</TableCell>
              <TableCell>{assignment.systemName}</TableCell>
              <TableCell>
                {format(new Date(assignment.assignedDate), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                {assignment.returnedDate
                  ? format(new Date(assignment.returnedDate), "MMM dd, yyyy")
                  : "-"}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === "Returned"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {assignment.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
