import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
// Path-ti apnar folder structure onujayi thik kore nin

export const metadata = {
  title: "GXON | Dashboard",
};
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-bg-light">
        {/* NextAuth Session Provider ekhane wrap hobe */}
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
