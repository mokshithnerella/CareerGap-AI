"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  History, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Award, 
  Trash2, 
  RefreshCw,
  TrendingUp,
  FileText
} from "lucide-react";
import { MatchReport } from "@/lib/api";

export default function HistoryPage() {
  const [reports, setReports] = useState<MatchReport[]>([]);

  useEffect(() => {
    // Read cached match history from localStorage
    const savedMatchStr = localStorage.getItem("careergap_latest_match");
    if (savedMatchStr) {
      try {
        const report = JSON.parse(savedMatchStr);
        setReports([report]);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("careergap_latest_match");
    localStorage.removeItem("careergap_match_id");
    setReports([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <History className="h-7 w-7 text-indigo-600" />
            Analysis History & Versioning
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review your previously generated match reports, compare scores over time, and inspect historical skill provenance.
          </p>
        </div>

        {reports.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear History
          </button>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <History className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-foreground">No Historical Reports Found</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Run a match analysis against any role to record report versions and track skill progression.
          </p>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Start Analysis <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-border/60 rounded-2xl border border-border bg-card overflow-hidden">
            {reports.map((report, idx) => (
              <div key={idx} className="p-6 hover:bg-muted/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Report ID: {report.match_id}</span>
                  </div>

                  <h2 className="text-lg font-bold text-foreground">
                    {report.role_title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {report.matched_skills_count} Matched
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {report.partial_skills_count} Partial
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      {report.missing_required_count} Required Gaps
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 block">
                      {report.overall_score}%
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Alignment Score
                    </span>
                  </div>

                  <Link
                    href="/analysis"
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    View Report <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
