"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center px-4 relative overflow-hidden">
      {/* ── Ambient blobs ── */}
      <div className="absolute -top-44 -left-36 w-[500px] h-[500px] rounded-full bg-indigo-600 opacity-[0.15] blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-[380px] h-[380px] rounded-full bg-cyan-500 opacity-10 blur-[90px] pointer-events-none" />

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl bg-gradient-to-br from-indigo-400 to-violet-500 bg-clip-text text-transparent select-none">
            ⬡
          </span>
          <span className="text-base font-bold tracking-tight text-slate-200">
            LearnForge
          </span>
        </div>

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-[1.75rem] font-bold tracking-tight text-slate-100 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-slate-400 tracking-wide"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-400 tracking-wide"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-indigo-500/[0.06] focus:ring-2 focus:ring-indigo-500/20"
            />
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
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-slate-600">or continue with demo</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Demo quick-fill buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() =>
              setForm({ email: "instructor@demo.com", password: "demo1234" })
            }
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-200 rounded-xl text-xs font-medium text-slate-400 transition-all duration-200 hover:-translate-y-px cursor-pointer"
          >
            <span>🎓</span>
            Instructor
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({ email: "student@demo.com", password: "demo1234" })
            }
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-200 rounded-xl text-xs font-medium text-slate-400 transition-all duration-200 hover:-translate-y-px cursor-pointer"
          >
            <span>📚</span>
            Student
          </button>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
