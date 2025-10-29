import type { Assignment } from "@/store/assignmentStore";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import UpdateAssignmentForm from "@/components/form/assignment/UpdateAssignmentForm";

interface AssignmentActionsCellProps {
  assignment: Assignment;
}

export function AssignmentActionsCell({
  assignment,
}: AssignmentActionsCellProps) {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate(`/assignments/${assignment.serialNumber}`);
  };
  return (
    <div className="flex items-center gap-2">
      <UpdateAssignmentForm assignment={assignment} />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleViewMore}
        className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 cursor-pointer dark:text-indigo-400 dark:hover:bg-indigo-950 flex items-center gap-1.5"
      >
        <Eye size={14} />
        View More
      </Button>
    </div>
  );
}
