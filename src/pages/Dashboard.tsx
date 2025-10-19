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
          <header className="flex items-center mb-5 justify-between w-full">
            {/* Left side: trigger + title */}
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-4xl font-bold"> Dashboard</h1>
            </div>

            {/* Right side: mode toggle + avatar */}
            <div className="flex gap-4 items-center">
              <SidebarTrigger />
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback>PI</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main body */}
          <main className="flex-1 w-full">
            <p className="text-lg">
              Your laptop assignment details will show here ✅
            </p>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
