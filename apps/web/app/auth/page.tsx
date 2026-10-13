"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register, loginAsDemo, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Please provide a valid email address.");
      return;
    }
    if (mode === "register" && !fullName) {
      setError("Please provide your full name.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(fullName, email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/40 via-background to-background dark:from-indigo-950/20 dark:via-background dark:to-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {mode === "login" ? "Welcome Back to CareerGap" : "Create Candidate Account"}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            {mode === "login" 
              ? "Sign in to access your resumes, benchmark reports, and roadmaps" 
              : "Register to unlock transparent skill-gap analysis and AI roadmaps"}
          </p>
        </div>

        {/* 1-Click Demo Highlight Card for Hackathon judges & testers */}
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/40 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white mt-0.5">
              <Zap className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h2 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
                Evaluation & Hackathon Demo Mode
              </h2>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                Instant access preloaded with synthetic candidate profile Alex Chen (Senior Undergraduate / Aspiring AI Engineer).
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="mt-3 w-full py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Launch Live Demo Session <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {/* Mode Switch Tabs */}
          <div className="flex border-b border-border/80 mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                mode === "login"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(null); }}
              className={`flex-1 pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                mode === "register"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Register Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === "register" && (
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Chen"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@university.edu"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {user && (
            <div className="mt-6 pt-4 border-t border-border/80 text-center">
              <span className="text-xs text-muted-foreground">
                Currently signed in as <strong className="text-foreground">{user.fullName}</strong> ({user.email})
              </span>
              <button
                type="button"
                onClick={logout}
                className="mt-2 block mx-auto text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Client-side data isolation with zero commercial retention</span>
        </div>
      </div>
    </div>
  );
}
