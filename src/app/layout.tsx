// import './globals.css';

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="antialiased">{children}</body>
//     </html>
//   );
// }

// components/AuthProvider.tsx (Ager ekti client component banan)


// app/layout.tsx
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
// Path-ti apnar folder structure onujayi thik kore nin


export const metadata = {
  title: "GXON | Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-bg-light">
        {/* NextAuth Session Provider ekhane wrap hobe */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}