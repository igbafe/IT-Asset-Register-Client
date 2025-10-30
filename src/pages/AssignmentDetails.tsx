// ...existing code...
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssignmentStore, type Assignment } from "@/store/assignmentStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserX, Trash2, Clock } from "lucide-react";

import Swal from "sweetalert2";
import {
  ActiveAssignmentCard,
  PreviousAssignmentsTable,
} from "@/components/table/assignments/AssignmentCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import ReassignForm from "@/components/form/assignment/ReassignForm";
// ...existing code...

export default function LaptopAssignmentDetails() {
  const { serialNumber } = useParams();
  const navigate = useNavigate();
  const { getAssignmentBySerialNumber, retireAssignment, loading } =
    useAssignmentStore();

  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(
    null
  );
  const [previousAssignments, setPreviousAssignments] = useState<Assignment[]>(
    []
  );

  useEffect(() => {
    if (serialNumber) {
      loadAssignments();
    } else {
      setCurrentAssignment(null);
      setPreviousAssignments([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialNumber]);

  const loadAssignments = async () => {
    if (!serialNumber) return;

    try {
      const data = await getAssignmentBySerialNumber(serialNumber);

      if (!data) {
        setCurrentAssignment(null);
        setPreviousAssignments([]);
        return;
      }

      const assignments: Assignment[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any).assignments)
        ? (data as any).assignments
        : [];

      // normalize to null when not found (avoids undefined)
      const active: Assignment | null =
        assignments.find((a) => a.status === "Active") ?? null;
      const history: Assignment[] = assignments.filter(
        (a) => a.status !== "Active"
      );

      setCurrentAssignment(active);
      setPreviousAssignments(history);
    } catch (error) {
      console.error("Failed to load assignments:", error);
      setCurrentAssignment(null);
      setPreviousAssignments([]);
    }
  };

  const handleRetire = async () => {
    const identifier = currentAssignment?.systemName;
    if (!identifier) {
      Swal.fire("Error", "Missing identifier for retire action", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Retire Laptop?",
      text: `This will permanently retire ${identifier}. All active assignments will be closed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Retire",
    });

    if (!result.isConfirmed) return;

    try {
      await retireAssignment(identifier);
      Swal.fire("Retired", "Laptop retired successfully", "success");
      navigate("/assignments");
    } catch (error) {
      console.error("Retire failed", error);
      Swal.fire("Error", "Failed to retire laptop", "error");
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
              Assignment for {currentAssignment?.systemName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Serial Number: {serialNumber}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="destructive"
              onClick={handleRetire}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Retire Laptop
            </Button>
            {serialNumber && currentAssignment?.systemName && (
              <ReassignForm
                serialNumber={serialNumber}
                systemName={currentAssignment.systemName}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        {/* Current Assignment Card */}
        {currentAssignment ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-green-600">👤</span>
              Current Assignment
            </h2>
            <ActiveAssignmentCard
              assignment={currentAssignment}
              onReassign={loadAssignments}
            />
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
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="text-gray-600" size={20} />
            Assignment History
          </h2>
          <PreviousAssignmentsTable assignments={previousAssignments} />
        </div>
      </main>
    </div>
  );
}
// ...existing code...
