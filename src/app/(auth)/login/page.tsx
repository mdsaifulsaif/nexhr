"use client";
import { useRouter } from "next/navigation";
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/api-service";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // 1. State setup for form data
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: ""
  // });

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     // 2. State theke data pathano hobe (FormData built-in class noy)
  //     const data = await authService.login(formData);

  //     if (data.success) {
  //       localStorage.setItem('auth_token', data.token);
  //       router.push('/');
  //     } else {
  //       alert(data.message || "Login failed");
  //     }
  //   } catch (error: any) {
  //     console.error("Login failed", error);
  //     // Backend error message handle kora
  //     alert(error.response?.data?.message || "Something went wrong");
  //   }
  // };

  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      alert("Login Failed: " + result.error);
    } else {
      router.push("/"); // Dashboard-e niye jabe
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light p-4">
      <div className="dashboard-card w-full max-w-md p-8 md:p-10 !shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30 mb-4">
            G
          </div>
          <h2 className="text-title text-center uppercase tracking-tight">
            Welcome Back
          </h2>
          <p className="text-subtitle mt-1">
            Enter your credentials to access account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative group">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="saiful@devfixter.com"
                value={formData.email} // 3. Binding state
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                } // 4. Updating state
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all text-sm font-medium"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password} // 3. Binding state
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                } // 4. Updating state
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all text-sm font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-subtitle">
            Don't have an account?
            <Link href="/register">
              <span className="ml-2 text-primary font-bold hover:underline cursor-pointer">
                Create Account
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
