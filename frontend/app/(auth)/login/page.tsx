"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Phone, Lock } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [countryCode, setCountryCode] = useState("+92");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!mobile) return setError("Please enter your mobile number");
    if (mobile.length < 5) return setError("Please enter a valid mobile number");
    if (!password) return setError("Please enter your password");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { mobile: countryCode + mobile, password });
      const { access_token, user } = res.data.data as { access_token: string; user: User };
      login(access_token, user);
      setUserName(user.name !== null ? user.name : "User");
      setSuccess(true);
      setTimeout(() => router.push("/home"), 2500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  const inputBase = {
    height: 52,
    background: "#eef2ff",
    border: "none",
    borderRadius: 16,
    fontSize: 14,
    color: "#1e293b",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: "#eef0f5" }}
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-[28px]"
        style={{ boxShadow: "0 16px 56px rgba(0,0,0,0.13)" }}
      >
        {/* LOGO */}
        <div className="flex flex-col items-center" style={{ padding: "40px 40px 20px" }}>
          <div style={{ filter: "drop-shadow(0 6px 18px rgba(239,83,80,0.38))" }}>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <ellipse cx="50" cy="68" rx="36" ry="20" fill="#ff7043" opacity="0.12" />
              <path d="M50 8 C35 25 20 38 22 58 C24 74 36 86 50 88 C64 86 76 74 78 58 C80 38 65 25 50 8Z" fill="url(#fo)" />
              <path d="M50 28 C42 40 36 50 38 62 C40 72 44 78 50 80 C56 78 60 72 62 62 C64 50 58 40 50 28Z" fill="url(#fi)" />
              <path d="M50 48 C46 54 44 60 46 66 C47 70 48.5 72 50 72 C51.5 72 53 70 54 66 C56 60 54 54 50 48Z" fill="#fff3e0" opacity="0.9" />
              <defs>
                <linearGradient id="fo" x1="50" y1="8" x2="50" y2="88" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffd54f" />
                  <stop offset="40%" stopColor="#ff7043" />
                  <stop offset="100%" stopColor="#c62828" />
                </linearGradient>
                <linearGradient id="fi" x1="50" y1="28" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffecb3" />
                  <stop offset="50%" stopColor="#ff8a65" />
                  <stop offset="100%" stopColor="#e53935" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-[21px] font-black tracking-widest mt-3" style={{ color: "#8B1A1A" }}>
            CLOUD SKY
          </h1>
        </div>

        {/* FORM */}
        <div style={{ padding: "0 40px 48px" }}>
          <h2 className="text-[30px] font-extrabold text-center" style={{ color: "#e53935" }}>
            Welcome Back
          </h2>
          <p className="text-center text-[13px] text-slate-400" style={{ marginTop: 8, marginBottom: 24 }}>
            Sign in to your Cloud Sky account
          </p>

          <hr style={{ borderColor: "#e5e7eb", marginBottom: 28 }} />

          {error && (
            <div className="px-4 py-3 rounded-2xl text-[13px] font-medium text-center"
              style={{ background: "#fff5f5", border: "1.5px solid #fca5a5", color: "#dc2626", marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Mobile */}
            <div style={{ marginBottom: 24 }}>
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700"
                style={{ marginBottom: 10 }}>
                <Phone size={14} className="text-red-500" />
                Mobile Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="text-slate-700 text-[13px] font-semibold focus:outline-none"
                  style={{
                    width: 148,
                    height: 52,
                    background: "#eef2ff",
                    border: "none",
                    borderRadius: 16,
                    paddingLeft: 16,
                    paddingRight: 8,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="3001234567"
                    className="w-full text-slate-800 text-[14px] placeholder:text-slate-300 focus:outline-none"
                    style={{ ...inputBase, paddingLeft: 44, paddingRight: 20 }}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700"
                style={{ marginBottom: 10 }}>
                <Lock size={14} className="text-red-500" />
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-slate-800 text-[14px] placeholder:text-slate-300 focus:outline-none"
                  style={{ ...inputBase, paddingLeft: 44, paddingRight: 54 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold text-[16px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                height: 56,
                background: loading
                  ? "#ef9a9a"
                  : "linear-gradient(135deg, #c62828 0%, #e53935 50%, #ef5350 100%)",
                borderRadius: 16,
                boxShadow: "0 8px 22px rgba(229,57,53,0.4)",
              }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : <>&#8594; Sign In</>}
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-400" style={{ marginTop: 24 }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold hover:underline" style={{ color: "#e53935" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Welcome {userName}!</h3>
            <p className="text-sm text-slate-400 mb-6">Redirecting to your dashboard...</p>
            <button
              onClick={() => router.push("/home")}
              className="w-full py-4 text-white font-bold rounded-full"
              style={{ background: "linear-gradient(135deg, #c62828, #ef5350)" }}
            >
              Go to Dashboard &#8594;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
