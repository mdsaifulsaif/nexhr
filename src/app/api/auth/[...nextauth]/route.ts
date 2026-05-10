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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
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
