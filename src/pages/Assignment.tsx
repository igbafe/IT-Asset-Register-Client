import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { DataTable } from "@/components/table/data-table";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import AssignForm from "@/components/form/assignment/AssignForm";
import { assignmentColumns } from "@/components/table/assignments/AssignmentColumns";
import { UserAvatar } from "@/components/Avatar";
import { useLaptopStore } from "@/store/useLaptopStore";
import type { Assignment } from "@/types/types";



export default function Assignments() {
  const { laptops, fetchLaptops } = useLaptopStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

 const assignments: Assignment[] = laptops
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
      status: laptop.status,
    }));

  const filteredAssignmets = assignments.filter((assignment) => {
    const term = searchTerm.toLowerCase();
    return (
      assignment.systemName.toLowerCase().includes(term) ||
      assignment.currentUser?.fullName.toLowerCase().includes(term) ||
      assignment.currentUser?.department.toLowerCase().includes(term) ||
      assignment.serialNumber.toLowerCase().includes(term)
    );
  });
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex mb-5 justify-between w-full sm:p-4 p-3 border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
            <h1 className="text-2xl sm:text-4xl font-bold truncate pr-4">
              Assignments
            </h1>

            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <UserAvatar /> 
            </div>
          </header>

          <main className="flex-1 flex flex-col gap-7 w-full p-4 sm:p-6 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Complete Laptop Inventory
              </h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search bar */}
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-9 pr-3 text-sm bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>

                <AssignForm />
                <div></div>
              </div>
            </div>

            <div className="mt-6">
              <DataTable
                columns={assignmentColumns}
                data={filteredAssignmets}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
