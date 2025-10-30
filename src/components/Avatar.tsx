import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function UserAvatar() {
  const { user } = useAuthStore();

  useEffect(() => {
    console.log("Current user:", user);
    console.log("User name:", user?.name);

    // Check localStorage directly
    const stored = localStorage.getItem("auth-storage");
    console.log("Stored in localStorage:", stored);
  }, [user]);

  const initials = user?.name
    ? user.name
        .split(" ") // Split by space
        .map((word) => word.charAt(0).toUpperCase()) // Take first letter of each
        .join("") // Join together
    : "U";

  return (
    <Avatar className="h-10 w-10 bg-[#4f46e5] flex items-center justify-center">
      <AvatarFallback className="text-lg font-semibold dark:text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
