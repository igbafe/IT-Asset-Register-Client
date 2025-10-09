import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns, type Payment } from "@/components/table/columns";

export default function Inventory() {
  // Temporary test data
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "123abc45",
      amount: 250,
      status: "success",
      email: "test@example.com",
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="flex mb-5 justify-between w-full p-4 border-b">
            <h1 className="text-2xl sm:text-4xl font-bold">Inventory</h1>

            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback>PI</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main body */}
          <main className="flex-1 flex flex-col gap-7 w-full p-4 overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Complete Laptop Inventory
            </h2>

            <div>
              <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-base cursor-pointer flex items-center gap-2">
                <Plus size={18} /> Add new Laptop
              </Button>

              <div className="mt-6">
                <DataTable columns={columns} data={data} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
