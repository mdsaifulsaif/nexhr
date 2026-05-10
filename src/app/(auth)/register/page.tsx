// app/(auth)/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiUserLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine } from 'react-icons/ri';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "Saiful Islam",
    email: "saif@gmail.com",
    password: "11111"
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registered Data:", formData);
    // Registration logic sesh hole login-e redirect korun
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light p-4">
      <div className="dashboard-card w-full max-w-md p-8 md:p-10 !shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30 mb-4 transition-transform hover:-rotate-6">
            G
          </div>
          <h2 className="text-title text-center uppercase tracking-tight">Create Account</h2>
          <p className="text-subtitle mt-1 text-center">Join us to start managing your employees efficiently</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all text-sm font-medium"
                required 
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="saif@gmail.com" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all text-sm font-medium"
                required 
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••" 
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all text-sm font-medium"
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 px-1 py-2">
            <input type="checkbox" className="mt-1 accent-primary w-4 h-4 rounded cursor-pointer" required id="terms" />
            <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
              I agree to the <span className="text-primary font-bold">Terms of Service</span> and <span className="text-primary font-bold">Privacy Policy</span>.
            </label>
          </div>

          {/* Register Button */}
          <button 
            type="submit" 
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            Create My Account
            <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center pt-6 border-t border-slate-50">
          <p className="text-subtitle">
            Already have an account? 
            <button onClick={() => router.push("/login")} className="ml-2 text-primary font-bold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
}