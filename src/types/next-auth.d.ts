import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Apnar dewa structure eikhane extend kora holo
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;      
      employee_id?: string; 
    } & DefaultSession["user"]; // Default name, email field gulo rakhar jonno
  }

  interface User {
    accessToken?: string;
    role?: string;
    employee_id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    employee_id?: string;
  }
}