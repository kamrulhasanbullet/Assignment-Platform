"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Role = "student" | "instructor";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as Role,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── Password strength ── */
  const getStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0 – 4
  };

  const strengthMeta = [
    { label: "", color: "bg-slate-700" },
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-orange-400" },
    { label: "Good", color: "bg-yellow-400" },
    { label: "Strong", color: "bg-green-500" },
  ];

  const pwdScore = getStrength(form.password);
  const strength = strengthMeta[pwdScore];

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* ── Ambient blobs ── */}
      <div className="absolute -top-48 -right-28 w-[480px] h-[480px] rounded-full bg-violet-600 opacity-[0.14] blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-[360px] h-[360px] rounded-full bg-cyan-500 opacity-[0.10] blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-fuchsia-600 opacity-[0.05] blur-[80px] pointer-events-none" />

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[440px] bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-7">
          <span className="text-2xl bg-gradient-to-br from-indigo-400 to-violet-500 bg-clip-text text-transparent select-none">
            ⬡
          </span>
          <span className="text-base font-bold tracking-tight text-slate-200">
            LearnForge
          </span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[1.65rem] font-bold tracking-tight text-slate-100 mb-1">
            Create your account
          </h1>
          <p className="text-sm text-slate-500">
            Join thousands of learners and instructors
          </p>
        </div>

        {/* ── Role Selector ── */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Student */}
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "student" })}
            className={`flex flex-col items-start gap-0.5 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              form.role === "student"
                ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                : "border-white/[0.08] bg-white/[0.03] hover:border-indigo-500/40 hover:bg-indigo-500/[0.07]"
            }`}
          >
            <span className="text-xl">📚</span>
            <span className="text-xs font-semibold text-slate-200 mt-1">
              Student
            </span>
            <span className="text-[11px] text-slate-500 leading-snug">
              Submit & track assignments
            </span>
          </button>

          {/* Instructor */}
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "instructor" })}
            className={`flex flex-col items-start gap-0.5 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              form.role === "instructor"
                ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                : "border-white/[0.08] bg-white/[0.03] hover:border-indigo-500/40 hover:bg-indigo-500/[0.07]"
            }`}
          >
            <span className="text-xl">🎓</span>
            <span className="text-xs font-semibold text-slate-200 mt-1">
              Instructor
            </span>
            <span className="text-[11px] text-slate-500 leading-snug">
              Create & grade assignments
            </span>
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium text-slate-400"
            >
              Full name
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="5.5"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M2 13c0-2.761 2.686-5 6-5s6 2.239 6 5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="name"
                type="text"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-slate-400"
            >
              Email address
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="1"
                  y="3.5"
                  width="14"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M1 5.5l7 4.5 7-4.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-slate-400"
            >
              Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="3"
                  y="7"
                  width="10"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M5 7V5a3 3 0 016 0v2"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Strength bar */}
            {form.password.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                        n <= pwdScore ? strength.color : "bg-white/[0.07]"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-[11px] font-medium min-w-[36px] transition-all duration-300 ${
                    pwdScore === 1
                      ? "text-red-400"
                      : pwdScore === 2
                        ? "text-orange-400"
                        : pwdScore === 3
                          ? "text-yellow-400"
                          : pwdScore === 4
                            ? "text-green-400"
                            : "text-slate-600"
                  }`}
                >
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm"
              className="text-xs font-medium text-slate-400"
            >
              Confirm password
            </label>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8l3.5 3.5L13 5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className={`w-full bg-white/[0.04] border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 ${
                  passwordsMismatch
                    ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                    : passwordsMatch
                      ? "border-green-500/40 focus:ring-2 focus:ring-green-500/20"
                      : "border-white/10 focus:border-indigo-500 focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
                }`}
              />
              {/* Match indicator */}
              {passwordsMatch && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-green-400"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M1.5 5l2.5 2.5 4.5-4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            {passwordsMismatch && (
              <p className="text-[11px] text-red-400 mt-0.5">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#f87171"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 5v4M8 11v.5"
                  stroke="#f87171"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-1 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_28px_rgba(99,102,241,0.45)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-[11px] text-slate-600 mt-4 mb-3 leading-relaxed">
          By registering, you agree to our{" "}
          <a
            href="#"
            className="text-indigo-400/80 hover:text-indigo-300 transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-indigo-400/80 hover:text-indigo-300 transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
