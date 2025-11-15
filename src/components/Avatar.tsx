import { useAuthStore } from "@/store/useAuthStore";

import { Avatar, AvatarFallback } from "./ui/avatar";

export function UserAvatar() {
  const { user } = useAuthStore();

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
