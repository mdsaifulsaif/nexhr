"use client";
import { useSession } from "next-auth/react";

// 'export' kothati function-er agey thaka dorkar
export const useLoggedUser = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    accessToken: (session as any)?.accessToken, // Type error fix
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
};