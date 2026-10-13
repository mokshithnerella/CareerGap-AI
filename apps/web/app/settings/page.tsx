"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Clock, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Check, 
  AlertCircle,
  Lock,
  Layers
} from "lucide-react";

export default function SettingsPage() {
  const [careerStage, setCareerStage] = useState("Undergraduate Student");
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [targetTimelineWeeks, setTargetTimelineWeeks] = useState(12);
  const [learningPreference, setLearningPreference] = useState("hands_on_projects");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem("careergap_user_preferences");
    if (savedPrefs) {
      try {
        const p = JSON.parse(savedPrefs);
        setCareerStage(p.careerStage || "Undergraduate Student");
        setWeeklyHours(p.weeklyHours || 10);
        setTargetTimelineWeeks(p.targetTimelineWeeks || 12);
        setLearningPreference(p.learningPreference || "hands_on_projects");
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSavePreferences = () => {
    const prefs = {
      careerStage,
      weeklyHours,
      targetTimelineWeeks,
      learningPreference,
    };
    localStorage.setItem("careergap_user_preferences", JSON.stringify(prefs));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const exportBundle = {
      exported_at: new Date().toISOString(),
      user_preferences: { careerStage, weeklyHours, targetTimelineWeeks, learningPreference },
      latest_analysis: JSON.parse(localStorage.getItem("careergap_latest_analysis") || "null"),
      latest_match: JSON.parse(localStorage.getItem("careergap_latest_match") || "null"),
      latest_roadmap: JSON.parse(localStorage.getItem("careergap_latest_roadmap") || "null"),
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `careergap-ai-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllData = () => {
    if (confirm("Are you sure you want to delete all stored resumes, skill analyses, and roadmaps? This action cannot be undone.")) {
      localStorage.clear();
      alert("All user-owned data has been securely purged.");
      window.location.href = "/";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-indigo-600" />
          Settings & Privacy Controls
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure learning pacing, export your structured candidate data, and manage client privacy.
        </p>
      </div>

      {/* Learning Preferences */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <User className="h-4 w-4 text-indigo-600" />
          Candidate Profile & Study Pacing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1.5">
              Current Education / Career Stage
            </label>
            <select
              value={careerStage}
              onChange={(e) => setCareerStage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="Undergraduate Student">Undergraduate Student</option>
              <option value="Graduate / Master's Student">Graduate / Master's Student</option>
              <option value="Bootcamp Graduate">Bootcamp Graduate</option>
              <option value="Career Transitioner">Career Transitioner</option>
              <option value="Junior Software Engineer">Junior Software Engineer</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1.5">
              Primary Learning Style
            </label>
            <select
              value={learningPreference}
              onChange={(e) => setLearningPreference(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="hands_on_projects">Hands-on Capstone Projects</option>
              <option value="documentation">Official Documentation & Specs</option>
              <option value="interactive">Interactive Exercises & Practice</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1.5">
              Available Weekly Study Commitment ({weeklyHours} hours/week)
            </label>
            <input
              type="range"
              min={2}
              max={30}
              step={1}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Roadmaps automatically calculate realistic milestones matching this workload.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1.5">
              Target Completion Timeline ({targetTimelineWeeks} weeks)
            </label>
            <input
              type="range"
              min={4}
              max={24}
              step={2}
              value={targetTimelineWeeks}
              onChange={(e) => setTargetTimelineWeeks(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Estimated calendar timeframe to achieve job readiness.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleSavePreferences}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                Preferences Saved!
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>
      </div>

      {/* Privacy Information Disclosure */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Privacy Statement & Data Protection
        </h2>
        <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <p>
            • <strong>No Uncontrolled Retention:</strong> Your PDF resume is parsed in memory to extract structured skills and evidence. We do not retain raw PDF documents on public object stores.
          </p>
          <p>
            • <strong>Transparent Scoring:</strong> Our matching engine operates deterministically. We never sell or share candidate data with third-party hiring aggregators.
          </p>
          <p>
            • <strong>Full Provenance:</strong> You retain ownership of all extracted entities and can delete or export your records at any time.
          </p>
        </div>
      </div>

      {/* Data Export & Account Deletion */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600" />
          Data Portability & Account Purge
        </h2>
        <p className="text-xs text-muted-foreground">
          Download a complete portable JSON export of your candidate profile, extracted skills, match reports, and roadmaps, or delete all records.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-background hover:bg-muted text-foreground transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4 text-indigo-500" />
            Export My Data (JSON)
          </button>

          <button
            onClick={handleDeleteAllData}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete All Data & Reset Account
          </button>
        </div>
      </div>
    </div>
  );
}
