// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

        try {
          const res = await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const responseData = await res.json();

          // Console-e check korar jonno
          console.log("Full Backend Response:", responseData);

          // Apnar dewa structure onujayi: data.success check korbo
          if (res.ok && responseData.success === true) {
            const { user, accessToken } = responseData.data; // data object theke user o token nilam

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role, // Extra info jodi dorkar hoy
              employee_id: user.employee_id,
              accessToken: accessToken, // Eita session-e pass hobe
            };
          }

          return null;
        } catch (error) {
          console.error("Login Fetch Error:", error);
          return null;
        }
      },
    }),
  ],
  //   callbacks: {
  //     async jwt({ token, user }) {
  //       if (user) {
  //         token.accessToken = (user as any).accessToken;
  //       }
  //       return token;
  //     },
  //     async session({ session, token }) {
  //       (session as any).accessToken = token.accessToken;
  //       return session;
  //     },
  //   },
  // app/api/auth/[...nextauth]/route.ts

  callbacks: {
    async jwt({ token, user }) {
      // Prothombari login korar somoy 'user' object-e backend-er data thake
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
        // Backend response-er 'data.user.employee_id' eikhane dhora hocche
        token.employee_id = (user as any).employee_id;
      }
      return token;
    },
    async session({ session, token }) {
      // JWT token theke data niye session-er user object-e dewa hocche
      if (session.user) {
        (session as any).accessToken = token.accessToken;
        (session.user as any).role = token.role;
        (session.user as any).employee_id = token.employee_id; // Frontend ekhon eita pabe
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Oboshoyoi thakte hobe
});

export { handler as GET, handler as POST };
