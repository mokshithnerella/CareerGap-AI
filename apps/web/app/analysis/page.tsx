"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert,
  ChevronDown,
  Layers,
  MapPin,
  RefreshCw,
  Cpu,
  BookOpen
} from "lucide-react";
import { api, MatchReport, ResumeAnalysisResponse } from "@/lib/api";

export default function AnalysisResultsPage() {
  const router = useRouter();
  const [report, setReport] = useState<MatchReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "matched" | "partial" | "missing">("all");

  useEffect(() => {
    async function calculateMatch() {
      setIsLoading(true);
      try {
        const storedAnalysisStr = localStorage.getItem("careergap_latest_analysis");
        const roleId = localStorage.getItem("careergap_selected_role_id") || "role_ai_engineer";
        const roleTitle = localStorage.getItem("careergap_selected_role_title") || "AI Engineer";
        const customReqsStr = localStorage.getItem("careergap_custom_requirements");

        let candidateSkills = [];
        if (storedAnalysisStr) {
          const parsed = JSON.parse(storedAnalysisStr);
          candidateSkills = parsed.skills;
        }

        const payload: any = {
          candidate_skills: candidateSkills,
          custom_role_title: roleTitle,
        };

        if (customReqsStr) {
          payload.custom_requirements = JSON.parse(customReqsStr);
        } else {
          payload.role_id = roleId;
        }

        const matchReport = await api.createMatchReport(payload);
        setReport(matchReport);
        localStorage.setItem("careergap_latest_match", JSON.stringify(matchReport));
        localStorage.setItem("careergap_match_id", matchReport.match_id);
      } catch (err) {
        console.error("Match computation error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    calculateMatch();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-foreground">Computing Deterministic Match Alignment...</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Evaluating candidate evidence against weighted required and preferred job criteria.
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-foreground">No Match Report Available</h2>
        <p className="text-xs text-muted-foreground mt-2 mb-4">
          Please upload a resume and select a target job role to generate your match analysis.
        </p>
        <Link
          href="/resume"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
        >
          Go to Resume Analyzer
        </Link>
      </div>
    );
  }

  const filteredItems = report.items.filter((item) => {
    if (activeFilter === "matched") return item.match_status === "matched";
    if (activeFilter === "partial") return item.match_status === "partial";
    if (activeFilter === "missing") return item.match_status === "not_detected";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Analysis Report • {report.role_title}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            Skill Alignment & Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Deterministic weighted comparison based on extracted resume evidence and job requirements.
          </p>
        </div>

        <Link
          href="/roadmap"
          className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          Generate Personalized Roadmap
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main Scoring Dashboard Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Circular/Gauge Overall Score */}
          <div className="md:col-span-4 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-border/60 pb-6 md:pb-0 md:pr-6">
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-muted/40"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000 ease-out"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - report.overall_score / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-foreground tracking-tight">
                  {report.overall_score}%
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                  Overall Alignment
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                report.overall_score >= 70
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : report.overall_score >= 50
                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
              }`}>
                {report.overall_score >= 70 ? "Strong Candidate Match" : report.overall_score >= 50 ? "Moderate Foundational Match" : "Significant Skill Gaps"}
              </span>
            </div>
          </div>

          {/* Breakdown & Metric Columns */}
          <div className="md:col-span-8 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-foreground">Required Core Coverage (80% Weight)</span>
                <span className="text-indigo-600 font-bold">{report.required_coverage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${report.required_coverage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-foreground">Preferred Qualifications (20% Weight)</span>
                <span className="text-blue-500 font-bold">{report.preferred_coverage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${report.preferred_coverage}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics Stats */}
            <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border/60 text-center">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="block text-lg font-bold text-emerald-600">{report.matched_skills_count}</span>
                <span className="text-[10px] text-muted-foreground">Matched (1.0)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="block text-lg font-bold text-amber-600">{report.partial_skills_count}</span>
                <span className="text-[10px] text-muted-foreground">Partial (0.5)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="block text-lg font-bold text-rose-600">{report.missing_required_count}</span>
                <span className="text-[10px] text-muted-foreground">Req. Gaps</span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted border border-border/40">
                <span className="block text-lg font-bold text-muted-foreground">{report.missing_preferred_count}</span>
                <span className="text-[10px] text-muted-foreground">Pref. Gaps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Explainable Formula Accordion */}
        <div className="mt-6 pt-4 border-t border-border/60">
          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-indigo-500" />
              View Mathematical Scoring Methodology & Audit Breakdown
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFormulaDetails ? "rotate-180" : ""}`} />
          </button>

          {showFormulaDetails && (
            <div className="mt-3 p-4 rounded-xl bg-muted/40 text-xs text-muted-foreground space-y-2 border border-border/40 font-mono">
              <p>
                <strong>Required Coverage:</strong> 100 × SUM(weight × match_value) / SUM(weight) = {report.required_coverage}% (Total weight: {report.required_weight_sum})
              </p>
              <p>
                <strong>Preferred Coverage:</strong> 100 × SUM(weight × match_value) / SUM(weight) = {report.preferred_coverage}% (Total weight: {report.preferred_weight_sum})
              </p>
              <p>
                <strong>Overall Score:</strong> 0.80 × {report.required_coverage} + 0.20 × {report.preferred_coverage} = <strong>{report.overall_score}%</strong>
              </p>
              <p className="text-[11px] text-muted-foreground font-sans pt-1">
                Match Values: 1.0 (Supported by evidence or confirmed), 0.5 (Partial evidence), 0.0 (Not detected in document).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Limitations Disclaimer Notice */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
        <p className="leading-relaxed">
          {report.limitations_disclaimer}
        </p>
      </div>

      {/* Itemized Match Details */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-foreground">
            Itemized Skill Evaluations ({report.items.length})
          </h2>

          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 py-1 rounded-lg ${activeFilter === "all" ? "bg-indigo-600 text-white font-semibold" : "bg-muted text-muted-foreground"}`}
            >
              All ({report.items.length})
            </button>
            <button
              onClick={() => setActiveFilter("matched")}
              className={`px-2.5 py-1 rounded-lg ${activeFilter === "matched" ? "bg-emerald-600 text-white font-semibold" : "bg-muted text-muted-foreground"}`}
            >
              Matched ({report.matched_skills_count})
            </button>
            <button
              onClick={() => setActiveFilter("partial")}
              className={`px-2.5 py-1 rounded-lg ${activeFilter === "partial" ? "bg-amber-600 text-white font-semibold" : "bg-muted text-muted-foreground"}`}
            >
              Partial ({report.partial_skills_count})
            </button>
            <button
              onClick={() => setActiveFilter("missing")}
              className={`px-2.5 py-1 rounded-lg ${activeFilter === "missing" ? "bg-rose-600 text-white font-semibold" : "bg-muted text-muted-foreground"}`}
            >
              Gaps ({report.missing_required_count + report.missing_preferred_count})
            </button>
          </div>
        </div>

        <div className="divide-y divide-border/60 rounded-xl border border-border bg-card overflow-hidden">
          {filteredItems.map((item, idx) => {
            const isMatch = item.match_status === "matched";
            const isPartial = item.match_status === "partial";
            const isMissing = item.match_status === "not_detected";

            return (
              <div key={idx} className="p-4 hover:bg-muted/20 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {isMatch && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}
                    {isPartial && <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />}
                    {isMissing && <XCircle className="h-4 w-4 text-rose-500 shrink-0" />}

                    <span className="font-bold text-sm text-foreground">
                      {item.canonical_name}
                    </span>

                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      item.is_required
                        ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {item.is_required ? "Required" : "Preferred"}
                    </span>

                    <span className="text-[10px] text-muted-foreground font-medium">
                      Weight: {item.weight}x
                    </span>

                    {item.source_page && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        Page {item.source_page}
                      </span>
                    )}
                  </div>

                  {item.evidence && (
                    <p className="text-xs text-muted-foreground italic pl-6">
                      "{item.evidence}"
                    </p>
                  )}

                  <p className="text-[11px] text-muted-foreground pl-6">
                    {item.explanation}
                  </p>
                </div>

                <div className="shrink-0 text-right pl-6 md:pl-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    isMatch
                      ? "bg-emerald-500/10 text-emerald-600"
                      : isPartial
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-rose-500/10 text-rose-600"
                  }`}>
                    Value: {item.match_value.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prioritized Skill Gaps Action Box */}
      {report.skill_gaps.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                Prioritized Skill Gaps for {report.role_title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ranked by topological prerequisites, requirement status, and job weight.
              </p>
            </div>

            <Link
              href="/roadmap"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Generate Roadmap <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.skill_gaps.slice(0, 4).map((gap, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">
                    #{gap.priority_rank} {gap.canonical_name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 font-semibold">
                    ~{gap.estimated_effort_hours}h effort
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {gap.why_it_matters}
                </p>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  → {gap.suggested_action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
