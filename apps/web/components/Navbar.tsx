"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  FileText, 
  Target, 
  BarChart3, 
  Map, 
  History, 
  Settings, 
  Compass,
  Menu,
  X,
  User,
  LogOut,
  Zap
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/resume", label: "Resume Analyzer", icon: FileText },
    { href: "/target-job", label: "Job Targeting", icon: Target },
    { href: "/analysis", label: "Match Score", icon: Compass },
    { href: "/roadmap", label: "Learning Roadmap", icon: Map },
    { href: "/history", label: "History", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-foreground flex items-center gap-1.5">
              CareerGap <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-semibold border border-indigo-500/20">AI</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">Career Intelligence Engine</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle, User Session, Demo Mode */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-border/60">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-muted/60 hover:bg-muted text-xs transition-colors"
                title={`Signed in as ${user.fullName}`}
              >
                <div className="h-6 w-6 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px]">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-foreground text-[11px] leading-tight">
                    {user.fullName}
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-tight">
                    {user.isDemo ? "Demo User" : "Candidate"}
                  </span>
                </div>
              </Link>

              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-muted-foreground hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/resume"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
          >
            Analyze Resume
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border/40 bg-background px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-600 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-indigo-600 px-3 py-1.5"
            >
              {user ? `Account: ${user.fullName}` : "Sign In / Demo Mode"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
