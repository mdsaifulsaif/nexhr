// app/(auth)/login/page.tsx
"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Ekhane authentication logic hobe (e.g., API call)
    // Login logic sesh hole dashboard-e redirect korbe
    router.push("/"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20">
            G
          </div>
        </div>
        <h2 className="text-2xl font-black text-center text-slate-800 mb-2">Welcome Back!</h2>
        <p className="text-center text-slate-400 text-sm mb-8">Please enter your details to login</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Email Address</label>
            <input type="email" placeholder="hello@example.com" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm" required />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm" required />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}