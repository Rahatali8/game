"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Phone, Lock, Cloud } from "lucide-react";
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
    background: "#eff6ff",
    border: "1.5px solid #bfdbfe",
    borderRadius: 16,
    fontSize: 14,
    color: "#1e293b",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: "#f8fafc" }}
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-[28px]"
        style={{ boxShadow: "0 20px 60px rgba(37,99,235,0.25)" }}
      >
        {/* LOGO */}
        <div
          className="flex flex-col items-center rounded-t-[28px]"
          style={{ padding: "40px 40px 24px", background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)" }}
        >
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-3"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
            <Cloud size={40} className="text-white" />
          </div>
          <h1 className="text-[22px] font-black tracking-widest text-white">
            CLOUD SKY
          </h1>
          <p className="text-blue-200 text-[12px] font-medium mt-1">CRYSTAL MINING</p>
        </div>

        {/* FORM */}
        <div style={{ padding: "32px 40px 48px" }}>
          <h2 className="text-[28px] font-extrabold text-center text-blue-900">
            Welcome Back
          </h2>
          <p className="text-center text-[13px] text-slate-400" style={{ marginTop: 6, marginBottom: 24 }}>
            Sign in to your Cloud Sky account
          </p>

          <hr style={{ borderColor: "#e2e8f0", marginBottom: 24 }} />

          {error && (
            <div className="px-4 py-3 rounded-2xl text-[13px] font-medium text-center"
              style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", color: "#dc2626", marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Mobile */}
            <div style={{ marginBottom: 20 }}>
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700"
                style={{ marginBottom: 8 }}>
                <Phone size={14} className="text-blue-600" />
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
                    background: "#eff6ff",
                    border: "1.5px solid #bfdbfe",
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
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
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
                style={{ marginBottom: 8 }}>
                <Lock size={14} className="text-blue-600" />
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
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
                  ? "#93c5fd"
                  : "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
                borderRadius: 16,
                boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
              }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : <>&#8594; Sign In</>}
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-400" style={{ marginTop: 24 }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-blue-600 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Welcome {userName}!</h3>
            <p className="text-sm text-slate-400 mb-6">Redirecting to your dashboard...</p>
            <button
              onClick={() => router.push("/home")}
              className="w-full py-4 text-white font-bold rounded-full"
              style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}
            >
              Go to Dashboard &#8594;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
