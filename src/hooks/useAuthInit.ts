import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const useAuthInit = () => {
  const { token, user, getCurrentUser } = useAuthStore();

  useEffect(() => {
    // If we have a token but no user data, fetch it
    if (token && !user) {
      getCurrentUser();
    }
  }, [token, user, getCurrentUser]);
};