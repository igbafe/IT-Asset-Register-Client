// ...existing code...
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserX, Trash2, Clock } from "lucide-react";

import Swal from "sweetalert2";
import {
  ActiveAssignmentCard,
  PreviousAssignmentsTable,
} from "@/components/table/assignments/AssignmentCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import ReassignForm from "@/components/form/assignment/ReassignForm";
import { useLaptopStore } from "@/store/useLaptopStore";
import type { AssignmentDetails } from "@/types/types";
import { useAssignmentStore } from "@/store/useAssignmentStore";

export default function LaptopAssignmentDetails() {
  const { serialNumber } = useParams();
  const navigate = useNavigate();
  const { laptops, fetchLaptops, loading } = useLaptopStore();
  const { returnCurrentUser } = useAssignmentStore();

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  const assignments: AssignmentDetails[] = laptops
    .filter((laptop) => laptop.currentUser && laptop._id)
    .map((laptop) => ({
      _id: laptop._id!,
      systemName: laptop.systemName,
      serialNumber: laptop.serialNumber,
      currentUser: laptop.currentUser
        ? {
            fullName: laptop.currentUser.fullName,
            email: laptop.currentUser.email,
            department: laptop.currentUser.department,
            assignedDate:
              laptop.currentUser.assignedDate instanceof Date
                ? laptop.currentUser.assignedDate.toISOString()
                : String(laptop.currentUser.assignedDate),
          }
        : null,
      previousUser: laptop.previousUser
        ? laptop.previousUser.map((user) => ({
            fullName: user.fullName,
            email: user.email,
            department: user.department,
            assignedDate:
              user.assignedDate instanceof Date
                ? user.assignedDate.toISOString()
                : String(user.assignedDate),
            returnedDate:
              user.returnedDate instanceof Date
                ? user.returnedDate.toISOString()
                : String(user.returnedDate),
          }))
        : [],
      status: laptop.status,
    }));

  const assignmentInfo = assignments.find(
    (a) => a.serialNumber === serialNumber
  );

  const handleReturn = async () => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to return ${assignmentInfo?.systemName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, return it!",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    const id = assignmentInfo?._id; // Get the id
    if (!id) {
      Swal.fire("Error", "Missing laptop ID", "error"); // Handle missing ID
      return;
    }

    try {
      await returnCurrentUser(id); // Call with the valid ID
      Swal.fire(
        "Success",
        `${assignmentInfo.systemName} has been returned.`,
        "success"
      );
    } catch (error) {
      console.log("Failed to return laptop", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-950">
      {loading && <LoadingOverlay />}
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 px-4 py-3 sm:px-6 sm:py-4 border-b sticky top-0 z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/assignments")}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft size={16} />
          Back to Assignments
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Assignment for {assignmentInfo?.systemName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Serial Number: {serialNumber}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="destructive"
              onClick={handleReturn}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Return Laptop
            </Button>
            {serialNumber && assignmentInfo?.systemName && (
              <ReassignForm
                serialNumber={serialNumber}
                systemName={assignmentInfo.systemName}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        {/* Current Assignment Card */}
        {assignmentInfo ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-green-600">👤</span>
              Current Assignment
            </h2>
            <ActiveAssignmentCard assignment={assignmentInfo} />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <UserX className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Active Assignment
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                This serial number currently has no active assignment.
              </p>
            </div>
          </div>
        )}

        {/* Previous Assignments Table */}
        {assignmentInfo ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="text-gray-600" size={20} />
              Assignment History
            </h2>
            <PreviousAssignmentsTable assignment={assignmentInfo} />
          </div>
        ) : (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Active Assignment
          </h3>
        )}
      </main>
    </div>
  );
}
