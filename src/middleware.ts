// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // হোম রুট (/) এবং ড্যাশবোর্ড প্রটেক্ট করার জন্য
  matcher: ["/", "/dashboard/:path*", "/profile/:path*"],
};