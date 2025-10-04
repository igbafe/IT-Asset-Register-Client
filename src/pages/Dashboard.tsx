import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LaptopDashboard() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        {/* Sidebar on the left */}
        <AppSidebar />

        {/* Main content on the right */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between  px-4 py-2 w-full">
            {/* Left side: trigger + title */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold"> Dashboard</h1>
            </div>

            {/* Right side: mode toggle + avatar */}
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback>PI</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main body */}
          <main className="flex-1 p-6  w-full">
            <p className="text-lg">
              Your laptop assignment details will show here ✅
            </p>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
