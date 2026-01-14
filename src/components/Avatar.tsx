import { useAuthStore } from "@/store/useAuthStore";

import { Avatar, AvatarFallback } from "./ui/avatar";

export function UserAvatar() {
  const { user } = useAuthStore();

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName.charAt(0).toUpperCase()}${user.lastName
          .charAt(0)
          .toUpperCase()}`
      : "U";

  return (
    <Avatar className="h-10 w-10 bg-[#4f46e5] flex items-center justify-center">
      <AvatarFallback className="text-lg font-semibold dark:text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
