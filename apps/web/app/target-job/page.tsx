"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Target, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Briefcase, 
  Plus, 
  Trash2, 
  SlidersHorizontal,
  ChevronRight,
  Layers,
  FileCode
} from "lucide-react";
import { api, JobRole, JobSkillRequirement } from "@/lib/api";

export default function TargetJobPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Custom Job Description Mode
  const [activeTab, setActiveTab] = useState<"library" | "custom">("library");
  const [customTitle, setCustomTitle] = useState("");
  const [customText, setCustomText] = useState("");
  const [isParsingCustom, setIsParsingCustom] = useState(false);
  const [parsedCustomRequirements, setParsedCustomRequirements] = useState<JobSkillRequirement[]>([]);

  useEffect(() => {
    async function loadRoles() {
      try {
        const fetched = await api.listJobRoles();
        setRoles(fetched);
        if (fetched.length > 0) {
          // Default to AI Engineer or first
          const defaultRole = fetched.find((r) => r.id === "role_ai_engineer") || fetched[0];
          setSelectedRole(defaultRole);
        }
      } catch (e) {
        console.error("Failed to load roles:", e);
      }
    }
    loadRoles();
  }, []);

  const handleParseCustomJob = async () => {
    if (!customText.trim()) return;
    setIsParsingCustom(true);
    try {
      const res = await api.parseJobDescription({
        job_title: customTitle || "Custom Position",
        raw_text: customText,
      });
      const allReqs = [...res.required_skills, ...res.preferred_skills];
      setParsedCustomRequirements(allReqs);
      localStorage.setItem("careergap_custom_job_id", res.job_id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsingCustom(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (activeTab === "library" && selectedRole) {
      localStorage.setItem("careergap_selected_role_id", selectedRole.id);
      localStorage.setItem("careergap_selected_role_title", selectedRole.title);
      router.push("/analysis");
    } else if (activeTab === "custom" && parsedCustomRequirements.length > 0) {
      localStorage.setItem("careergap_selected_role_title", customTitle || "Custom Target Role");
      localStorage.setItem("careergap_custom_requirements", JSON.stringify(parsedCustomRequirements));
      router.push("/analysis");
    }
  };

  const categories = ["all", "Artificial Intelligence", "Software Engineering", "Data & Analytics", "Infrastructure & Cloud", "Security", "Quality Engineering"];

  const filteredRoles = roles.filter((r) => {
    const matchesCat = categoryFilter === "all" || r.category === categoryFilter;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Target className="h-7 w-7 text-indigo-600" />
            Job Targeting & Requirement Benchmark
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Benchmark your candidate profile against standard industry engineering roles or paste an employer job description.
          </p>
        </div>

        <button
          onClick={handleStartAnalysis}
          disabled={activeTab === "library" ? !selectedRole : parsedCustomRequirements.length === 0}
          className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          Run Skill Gap Matching
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-border mb-8 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab("library")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "library"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Industry Role Library (15 Roles)
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "custom"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCode className="h-4 w-4" />
          Paste Custom Job Description
        </button>
      </div>

      {/* Library View */}
      {activeTab === "library" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Roles Selector Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search & Category Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search 15 roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize transition-colors ${
                      categoryFilter === cat
                        ? "bg-indigo-600 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Roles */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredRoles.map((role) => {
                const isSelected = selectedRole?.id === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs"
                        : "border-border bg-card hover:bg-muted/30"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                        {role.category}
                      </span>
                      <h3 className="font-bold text-sm text-foreground">
                        {role.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {role.description}
                      </p>
                    </div>

                    <ChevronRight className={`h-4 w-4 shrink-0 mt-1 transition-transform ${isSelected ? "text-indigo-600 translate-x-0.5" : "text-muted-foreground"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Specification Column */}
          <div className="lg:col-span-7">
            {selectedRole ? (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{selectedRole.category}</span>
                    <span className="text-indigo-600 font-semibold">{selectedRole.required_skills.length} Required • {selectedRole.preferred_skills.length} Preferred</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-foreground">{selectedRole.title}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                    {selectedRole.description}
                  </p>
                </div>

                {/* Required Skills Table */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    Required Core Competencies (80% Scoring Weight)
                  </h3>
                  <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
                    {selectedRole.required_skills.map((req, i) => (
                      <div key={i} className="p-3 bg-muted/10 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-foreground">{req.canonical_name}</span>
                          <span className="text-[10px] text-muted-foreground ml-2 capitalize">({req.category.replace("_", " ")})</span>
                          {req.description && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">{req.description}</p>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600">
                          Weight: {req.weight}x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                {selectedRole.preferred_skills.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                      Preferred & Bonus Qualifications (20% Scoring Weight)
                    </h3>
                    <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
                      {selectedRole.preferred_skills.map((req, i) => (
                        <div key={i} className="p-3 bg-muted/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-foreground">{req.canonical_name}</span>
                            <span className="text-[10px] text-muted-foreground ml-2 capitalize">({req.category.replace("_", " ")})</span>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            Weight: {req.weight}x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Capstone Projects */}
                {selectedRole.suggested_projects.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-foreground mb-2">Recommended Capstone Deliverables</h3>
                    <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                      {selectedRole.suggested_projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full py-3 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Match Against {selectedRole.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-muted-foreground border border-border rounded-2xl bg-card">
                Select a role from the library to view full requirements.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Job Description Mode */}
      {activeTab === "custom" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">Paste Employer Job Description</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paste the text from LinkedIn, Indeed, or a company careers portal. Our requirement parser will extract required skills, preferred qualifications, and map canonical categories.
            </p>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Position Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Senior Machine Learning Engineer"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Job Description Content</label>
              <textarea
                rows={8}
                placeholder="Paste requirements, qualifications, and role description here..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-3 text-xs rounded-lg border border-border bg-background text-foreground font-mono focus:outline-none"
              />
            </div>

            <button
              onClick={handleParseCustomJob}
              disabled={isParsingCustom || !customText.trim()}
              className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isParsingCustom ? "Extracting Requirements..." : "Extract Job Requirements"}
            </button>
          </div>

          {/* Parsed Requirements Review & Edit */}
          {parsedCustomRequirements.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Extracted Requirements ({parsedCustomRequirements.length})
                </h3>
                <span className="text-xs text-muted-foreground">Click toggle to adjust Required vs Preferred</span>
              </div>

              <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
                {parsedCustomRequirements.map((req, i) => (
                  <div key={i} className="p-3 bg-muted/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-foreground">{req.canonical_name}</span>
                      <span className="text-[10px] text-muted-foreground ml-2 capitalize">({req.category})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const updated = [...parsedCustomRequirements];
                          updated[i].is_required = !updated[i].is_required;
                          setParsedCustomRequirements(updated);
                        }}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded transition-colors ${
                          req.is_required
                            ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {req.is_required ? "Required (80%)" : "Preferred (20%)"}
                      </button>

                      <button
                        onClick={() => {
                          const updated = parsedCustomRequirements.filter((_, idx) => idx !== i);
                          setParsedCustomRequirements(updated);
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartAnalysis}
                className="w-full py-3 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Run Match Against Custom Job</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
