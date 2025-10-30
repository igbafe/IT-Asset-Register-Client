import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Search } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/laptopDetails/laptopColumns";
import { useLaptopDetailsStore } from "@/store/laptopDetailsStore";
import { useEffect, useState } from "react";
import AddForm from "@/components/form/laptopdetails/AddForm";
import { UserAvatar } from "@/components/Avatar";

export default function Inventory() {
  const { laptops, fetchLaptops } = useLaptopDetailsStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all laptops when component loads
  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  // Filter laptops by search term (case-insensitive)
  const filteredLaptops = laptops.filter((laptop) => {
    const term = searchTerm.toLowerCase();
    return (
      laptop.systemName.toLowerCase().includes(term) ||
      laptop.brand.toLowerCase().includes(term) ||
      laptop.model.toLowerCase().includes(term) ||
      laptop.serialNumber.toLowerCase().includes(term)
    );
  });

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
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
                    placeholder="Search laptops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-9 pr-3 text-sm bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>

                <AddForm />
                <div></div>
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
