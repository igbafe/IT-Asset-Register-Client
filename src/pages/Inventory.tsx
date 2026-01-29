import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Search } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/laptopDetails/laptopColumns";
import { useLaptopStore } from "@/store/useLaptopStore";
import { useEffect, useState, useMemo } from "react";
import AddForm from "@/components/form/laptopdetails/AddForm";
import { UserAvatar } from "@/components/Avatar";
import { SelectStatus } from "@/components/selectStatus";
import { statusOptions } from "@/constants/constants";

export default function Inventory() {
  const { laptops, fetchLaptops } = useLaptopStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchLaptops();
  }, []); 

  const filteredLaptops = useMemo(() => {
    return laptops.filter((laptop) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        laptop.systemName.toLowerCase().includes(term) ||
        laptop.serialNumber.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || laptop.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [laptops, searchTerm, statusFilter]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />

        <div className="flex-1 p-5 flex flex-col min-w-0">
          <header className="flex mb-5 justify-between w-full sm:p-4 p-3 border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
            <h1 className="text-2xl sm:text-4xl font-bold truncate pr-4">
              Inventory
            </h1>

            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <UserAvatar />
            </div>
          </header>

          <main className="flex-1 flex flex-col gap-7 w-full p-4 sm:p-6 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search bar */}
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by Name and SN"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-9 pr-3 text-sm bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
                <SelectStatus
                  label="Filter by Status"
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  options={statusOptions}
                />
              </div>
              <div>
                <AddForm />
              </div>
            </div>

            <div className="mt-6">
              <DataTable columns={columns} data={filteredLaptops} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}