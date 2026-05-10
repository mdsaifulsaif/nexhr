// components/AuthProvider.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

// Named function bebohar kora bhalo jate conflict na hoy
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}