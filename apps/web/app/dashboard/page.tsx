"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Sparkles, 
  FileText, 
  Target, 
  Map, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Award,
  Layers,
  ChevronRight,
  Plus
} from "lucide-react";
import { 
  ResumeAnalysisResponse, 
  MatchReport, 
  Roadmap 
} from "@/lib/api";

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<ResumeAnalysisResponse | null>(null);
  const [matchReport, setMatchReport] = useState<MatchReport | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>("AI Engineer");

  useEffect(() => {
    const savedAnalysis = localStorage.getItem("careergap_latest_analysis");
    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis));
      } catch (e) {
        // ignore
      }
    }

    const savedMatch = localStorage.getItem("careergap_latest_match");
    if (savedMatch) {
      try {
        setMatchReport(JSON.parse(savedMatch));
      } catch (e) {
        // ignore
      }
    }

    const savedRoadmap = localStorage.getItem("careergap_latest_roadmap");
    if (savedRoadmap) {
      try {
        setRoadmap(JSON.parse(savedRoadmap));
      } catch (e) {
        // ignore
      }
    }

    const savedRoleTitle = localStorage.getItem("careergap_selected_role_title");
    if (savedRoleTitle) {
      setSelectedRoleTitle(savedRoleTitle);
    }
  }, []);

  const hasData = Boolean(analysis || matchReport || roadmap);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Candidate Intelligence Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            CareerGap Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your technical alignment, active skill gap resolutions, and personalized roadmap progress.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/resume"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Resume Analysis
          </Link>
        </div>
      </div>

      {/* Meaningful Empty State if user has not yet uploaded or run analysis */}
      {!hasData && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Welcome to CareerGap AI</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            You don't have an active resume analysis yet. Upload your PDF resume or try our pre-built synthetic profile to start benchmarking against tech roles.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/resume"
              className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
            >
              Analyze Resume Now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid with Persisted Data */}
      {hasData && (
        <div className="space-y-8">
          {/* Top 3 KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Alignment Score Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Target Role Benchmark</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{matchReport?.role_title || selectedRoleTitle}</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-foreground">
                    {matchReport ? `${matchReport.overall_score}%` : "—"}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">Alignment Match</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${matchReport?.overall_score || 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {matchReport 
                    ? `Required: ${matchReport.required_coverage}% • Preferred: ${matchReport.preferred_coverage}%`
                    : "Benchmark against selected role to compute alignment."}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60">
                <Link
                  href="/analysis"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between"
                >
                  <span>View Full Alignment Breakdown</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 2. Resume Profile Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Active Resume</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-foreground">
                    {analysis ? analysis.skills.length : "—"}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">Extracted Skills</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                  {analysis?.summary || "No resume currently stored. Upload a PDF to extract entities."}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60">
                <Link
                  href="/resume"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between"
                >
                  <span>Review Extracted Provenance</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 3. Roadmap Progress Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Active Roadmap</span>
                  <span className="text-blue-500 font-semibold">{roadmap?.weekly_hours || 10}h / week</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-emerald-600">
                    {roadmap && roadmap.total_tasks_count > 0
                      ? `${Math.round((roadmap.completed_tasks_count / roadmap.total_tasks_count) * 100)}%`
                      : "0%"}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    ({roadmap?.completed_tasks_count || 0}/{roadmap?.total_tasks_count || 0} Tasks Done)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{
                      width: `${
                        roadmap && roadmap.total_tasks_count > 0
                          ? Math.round((roadmap.completed_tasks_count / roadmap.total_tasks_count) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {roadmap ? `${roadmap.phases.length} Phases • ~${roadmap.estimated_duration_weeks} Weeks Estimated` : "Generate a roadmap to begin tracking study progress."}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60">
                <Link
                  href="/roadmap"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between"
                >
                  <span>Open Interactive Roadmap</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Detailed Skill Gap & Match Status Breakdown */}
          {matchReport && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Skill Gap Alignment Breakdown ({matchReport.role_title})
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Categorized into matched competencies, partially demonstrated evidence, and priority gaps.
                  </p>
                </div>

                <Link
                  href="/analysis"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Inspect Full Proofs <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Matched */}
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Matched Competencies ({matchReport.matched_skills_count})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {matchReport.items
                      .filter((i) => i.match_status === "matched")
                      .map((item, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                          {item.canonical_name}
                        </span>
                      ))}
                    {matchReport.matched_skills_count === 0 && (
                      <span className="text-xs text-muted-foreground">No matches detected.</span>
                    )}
                  </div>
                </div>

                {/* Partial */}
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Partially Supported ({matchReport.partial_skills_count})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {matchReport.items
                      .filter((i) => i.match_status === "partial")
                      .map((item, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
                          {item.canonical_name}
                        </span>
                      ))}
                    {matchReport.partial_skills_count === 0 && (
                      <span className="text-xs text-muted-foreground">None detected.</span>
                    )}
                  </div>
                </div>

                {/* Missing / Gaps */}
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
                    <span className="flex items-center gap-1.5">
                      <XCircle className="h-4 w-4 text-rose-500" />
                      Identified Gaps ({matchReport.missing_required_count + matchReport.missing_preferred_count})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {matchReport.items
                      .filter((i) => i.match_status === "not_detected")
                      .map((item, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 font-medium">
                          {item.canonical_name} ({item.is_required ? "Req" : "Pref"})
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Navigator Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/resume"
              className="p-5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Manage Resume</h3>
                  <p className="text-xs text-muted-foreground">Upload, edit skills, delete PDF</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/target-job"
              className="p-5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Switch Target Role</h3>
                  <p className="text-xs text-muted-foreground">Select from 15 library roles</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/roadmap"
              className="p-5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <Map className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Study Roadmap</h3>
                  <p className="text-xs text-muted-foreground">Track task progress & resources</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
