"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Sparkles, 
  ExternalLink,
  Edit2,
  Plus,
  RefreshCw,
  Search,
  ArrowRight,
  ShieldAlert,
  Info
} from "lucide-react";
import { api, ResumeAnalysisResponse, ExtractedSkill } from "@/lib/api";

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"skills" | "preview" | "entities">("skills");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New Skill Modal / Inline State
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("programming_language");
  const [newSkillEvidence, setNewSkillEvidence] = useState("");

  // Load existing analysis on mount if in localStorage/API
  useEffect(() => {
    const saved = localStorage.getItem("careergap_latest_analysis");
    if (saved) {
      try {
        setAnalysis(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith(".pdf")) {
        setErrorMessage("Only PDF documents (.pdf) are supported.");
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setErrorMessage("File exceeds maximum allowed limit of 10 MB.");
        return;
      }
      setErrorMessage(null);
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(20);
    setErrorMessage(null);

    try {
      setUploadProgress(50);
      const res = await api.uploadResume(file);
      setUploadProgress(100);
      setAnalysis(res);
      localStorage.setItem("careergap_latest_analysis", JSON.stringify(res));
      localStorage.setItem("careergap_resume_id", res.resume_id);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process PDF resume.");
    } finally {
      setIsUploading(false);
    }
  };

  // 1-Click Synthetic Sample Resume Loader for Hackathon / Testing
  const handleLoadSampleResume = async (type: "ai" | "web") => {
    setIsUploading(true);
    setErrorMessage(null);
    setUploadProgress(40);

    // Synthetic parsed analysis for immediate testing
    const sampleAnalysis: ResumeAnalysisResponse = {
      resume_id: `res_sample_${Date.now()}`,
      summary: type === "ai" 
        ? "Candidate with strong Python, PyTorch, and classical Machine Learning background, having built end-to-end computer vision and LLM fine-tuning pipelines."
        : "Full-Stack developer proficient in TypeScript, React, Next.js, and Node.js with database experience in PostgreSQL.",
      page_count: 2,
      char_count: 2450,
      skills: type === "ai"
        ? [
            {
              canonical_name: "Python",
              category: "programming_language",
              evidence: "Engineered scalable data processing pipelines in Python using multiprocessing and asyncio.",
              evidence_type: "project",
              confidence: 0.98,
              proficiency: "advanced",
              years_experience: 2,
              source_page: 1,
              user_confirmed: true,
            },
            {
              canonical_name: "PyTorch",
              category: "ai_ml",
              evidence: "Implemented transformer attention models from scratch in PyTorch; reduced training loss by 18%.",
              evidence_type: "project",
              confidence: 0.95,
              proficiency: "intermediate",
              years_experience: 1,
              source_page: 1,
              user_confirmed: true,
            },
            {
              canonical_name: "Machine Learning",
              category: "ai_ml",
              evidence: "Trained Random Forests and Gradient Boosted trees for churn prediction on 200k customer records.",
              evidence_type: "work_experience",
              confidence: 0.94,
              proficiency: "intermediate",
              years_experience: 1.5,
              source_page: 1,
              user_confirmed: false,
            },
            {
              canonical_name: "SQL",
              category: "programming_language",
              evidence: "Wrote complex analytical window queries and aggregations in PostgreSQL.",
              evidence_type: "work_experience",
              confidence: 0.90,
              proficiency: "intermediate",
              years_experience: 1,
              source_page: 2,
              user_confirmed: false,
            },
            {
              canonical_name: "Git",
              category: "tools",
              evidence: "Collaborated on open source repositories using Git and feature branches.",
              evidence_type: "project",
              confidence: 0.92,
              proficiency: "intermediate",
              years_experience: 2,
              source_page: 2,
              user_confirmed: true,
            },
          ]
        : [
            {
              canonical_name: "TypeScript",
              category: "programming_language",
              evidence: "Built production client-side applications with TypeScript strict type-checking.",
              evidence_type: "project",
              confidence: 0.95,
              proficiency: "intermediate",
              years_experience: 2,
              source_page: 1,
              user_confirmed: true,
            },
            {
              canonical_name: "React",
              category: "framework",
              evidence: "Developed accessible component systems and dynamic charts in React.",
              evidence_type: "project",
              confidence: 0.96,
              proficiency: "advanced",
              years_experience: 2,
              source_page: 1,
              user_confirmed: true,
            },
            {
              canonical_name: "Next.js",
              category: "framework",
              evidence: "Shipped SSR applications using Next.js 14 App Router and server actions.",
              evidence_type: "project",
              confidence: 0.92,
              proficiency: "intermediate",
              years_experience: 1,
              source_page: 1,
              user_confirmed: true,
            },
            {
              canonical_name: "PostgreSQL",
              category: "database",
              evidence: "Designed relational database schemas with Prisma ORM and PostgreSQL.",
              evidence_type: "project",
              confidence: 0.88,
              proficiency: "intermediate",
              years_experience: 1,
              source_page: 2,
              user_confirmed: false,
            },
          ],
      projects: [
        {
          title: type === "ai" ? "Autonomous RAG Document Query Engine" : "E-Commerce Collaborative Storefront",
          description: type === "ai" 
            ? "Built vector retrieval engine with hybrid BM25 and embeddings."
            : "Next.js 14 storefront with payment integration and PostgreSQL.",
          technologies: type === "ai" ? ["Python", "PyTorch"] : ["TypeScript", "React", "Next.js"],
          source_page: 1,
        }
      ],
      experience: [
        {
          role: "Software Engineering Intern",
          organization: "Tech Innovations Lab",
          duration: "May 2024 - Aug 2024",
          description: "Engineered automated test suites and backend endpoints.",
          technologies: ["Python", "Git"],
          source_page: 1,
        }
      ],
      education: [
        {
          degree: "B.S. in Computer Science",
          institution: "State University",
          graduation_year: "2025",
          source_page: 2,
        }
      ],
      certifications: [],
      raw_text_preview: "Alex Chen | Computer Science Senior\nSkills: Python, PyTorch, Machine Learning, SQL, Git...\nProjects: Autonomous RAG Engine\nExperience: Software Engineering Intern at Tech Innovations Lab...",
      provider_used: "Synthetic Development Demo Fixture",
      ocr_applied: false,
    };

    setTimeout(() => {
      setUploadProgress(100);
      setAnalysis(sampleAnalysis);
      localStorage.setItem("careergap_latest_analysis", JSON.stringify(sampleAnalysis));
      localStorage.setItem("careergap_resume_id", sampleAnalysis.resume_id);
      setIsUploading(false);
    }, 400);
  };

  const handleToggleConfirmSkill = (index: number) => {
    if (!analysis) return;
    const updatedSkills = [...analysis.skills];
    updatedSkills[index].user_confirmed = !updatedSkills[index].user_confirmed;
    const updatedAnalysis = { ...analysis, skills: updatedSkills };
    setAnalysis(updatedAnalysis);
    localStorage.setItem("careergap_latest_analysis", JSON.stringify(updatedAnalysis));
  };

  const handleAddManualSkill = () => {
    if (!analysis || !newSkillName.trim()) return;
    const newSkill: ExtractedSkill = {
      canonical_name: newSkillName.trim(),
      category: newSkillCategory,
      evidence: newSkillEvidence.trim() || "User manually added and verified competency.",
      evidence_type: "skills_section",
      confidence: 1.0,
      proficiency: "intermediate",
      years_experience: 1,
      source_page: 1,
      user_confirmed: true,
    };
    const updatedSkills = [...analysis.skills, newSkill];
    const updatedAnalysis = { ...analysis, skills: updatedSkills };
    setAnalysis(updatedAnalysis);
    localStorage.setItem("careergap_latest_analysis", JSON.stringify(updatedAnalysis));
    setNewSkillName("");
    setNewSkillEvidence("");
  };

  const handleDeleteResume = async () => {
    if (!analysis) return;
    try {
      await api.deleteResume(analysis.resume_id);
    } catch {
      // ignore
    }
    setAnalysis(null);
    setFile(null);
    localStorage.removeItem("careergap_latest_analysis");
    localStorage.removeItem("careergap_resume_id");
  };

  const filteredSkills = (analysis?.skills || []).filter((s) => {
    const matchesCat = filterCategory === "all" || s.category === filterCategory;
    const matchesQuery = s.canonical_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Resume Analyzer & Skill Extraction
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Securely extract readable text, identify canonical skills with exact sentence provenance, and edit results.
          </p>
        </div>

        {analysis && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteResume}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Resume
            </button>
            <Link
              href="/target-job"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              Target a Job Role
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Upload Zone / Dropzone */}
      {!analysis && (
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-border hover:border-indigo-500/50 bg-card p-8 sm:p-12 text-center transition-all">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8" />
            </div>

            <h3 className="text-lg font-bold text-foreground">
              {file ? file.name : "Upload Your Resume in PDF Format"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Maximum file size: 10 MB. Text is processed securely page by page using PyMuPDF.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <label className="cursor-pointer px-6 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors">
                <span>Select PDF File</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Processing PDF...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Extract Skills
                    </>
                  )}
                </button>
              )}
            </div>

            {isUploading && (
              <div className="mt-6 max-w-xs mx-auto">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Validating document structure & parsing text pages...
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Quick Hackathon Demo Pickers */}
          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-3">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Instant Hackathon Demo Data (No PDF Required)
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Don't have a PDF resume on hand? Click either sample profile below to immediately test genuine entity extraction, deterministic scoring, and personalized roadmap generation:
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleLoadSampleResume("ai")}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                <span>🚀 Load Sample AI & Machine Learning Resume</span>
              </button>
              <button
                onClick={() => handleLoadSampleResume("web")}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <span>💻 Load Sample Full-Stack Developer Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  PDF Parsed Successfully ({analysis.page_count} Pages • {analysis.char_count} Chars)
                </span>
                <h2 className="text-lg font-bold text-foreground">Candidate Summary</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {analysis.skills.length}
                </span>
                <span className="block text-[11px] text-muted-foreground font-medium">
                  Skills Extracted
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <span>Engine: {analysis.provider_used}</span>
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3 text-blue-500" />
                Click any skill checkbox to manually confirm proficiency
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border/60 gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("skills")}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === "skills"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Extracted Skills & Provenance ({analysis.skills.length})
            </button>
            <button
              onClick={() => setActiveTab("entities")}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === "entities"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Projects & Experience ({analysis.projects.length + analysis.experience.length})
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === "preview"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Extracted Document Text
            </button>
          </div>

          {/* Tab 1: Skills Table */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search extracted skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="programming_language">Languages</option>
                    <option value="framework">Frameworks</option>
                    <option value="database">Databases</option>
                    <option value="cloud_devops">Cloud & DevOps</option>
                    <option value="ai_ml">AI & ML</option>
                    <option value="tools">Tools</option>
                  </select>
                </div>
              </div>

              {/* Skills List */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="divide-y divide-border/60">
                  {filteredSkills.map((skill, idx) => (
                    <div key={idx} className="p-4 hover:bg-muted/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={skill.user_confirmed}
                            onChange={() => handleToggleConfirmSkill(idx)}
                            className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            title="Confirm this skill"
                          />
                          <span className="font-bold text-sm text-foreground">
                            {skill.canonical_name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-medium text-muted-foreground uppercase">
                            {skill.category}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 font-semibold">
                            Page {skill.source_page}
                          </span>
                          {skill.user_confirmed && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
                              Verified by Candidate
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground italic pl-6">
                          "{skill.evidence}"
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pl-6 md:pl-0">
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-foreground capitalize block">
                            {skill.proficiency}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Confidence: {Math.round(skill.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredSkills.length === 0 && (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      No skills match your filter criteria.
                    </div>
                  )}
                </div>
              </div>

              {/* Add Manual Skill Form */}
              <div className="p-4 rounded-xl border border-border bg-card">
                <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-indigo-500" />
                  Add or Correct a Missing Skill
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Skill name (e.g. PyTorch, Docker)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground"
                  />
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="programming_language">Programming Language</option>
                    <option value="framework">Framework</option>
                    <option value="database">Database</option>
                    <option value="cloud_devops">Cloud & DevOps</option>
                    <option value="ai_ml">AI & ML</option>
                    <option value="tools">Tool / Platform</option>
                  </select>
                  <button
                    onClick={handleAddManualSkill}
                    disabled={!newSkillName.trim()}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    Add Verified Skill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Extracted Projects & Experience */}
          {activeTab === "entities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Projects */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">
                  Extracted Projects ({analysis.projects.length})
                </h3>
                <div className="space-y-4">
                  {analysis.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border/40 text-xs">
                      <div className="font-semibold text-foreground">{proj.title}</div>
                      <p className="text-muted-foreground mt-1 text-[11px]">{proj.description}</p>
                      {proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.technologies.map((t, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {analysis.projects.length === 0 && (
                    <p className="text-xs text-muted-foreground">No specific project blocks detected.</p>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">
                  Work Experience ({analysis.experience.length})
                </h3>
                <div className="space-y-4">
                  {analysis.experience.map((exp, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border/40 text-xs">
                      <div className="font-semibold text-foreground">{exp.role}</div>
                      <div className="text-[11px] text-muted-foreground">{exp.organization} • {exp.duration || "N/A"}</div>
                      <p className="text-muted-foreground mt-1 text-[11px]">{exp.description}</p>
                    </div>
                  ))}
                  {analysis.experience.length === 0 && (
                    <p className="text-xs text-muted-foreground">No explicit employment entries detected.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Extracted Text Preview */}
          {activeTab === "preview" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-bold text-foreground mb-2">Raw Extracted PDF Text Preview</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Showing sanitized page-by-page text extracted by PyMuPDF engine.
              </p>
              <pre className="p-4 rounded-lg bg-muted font-mono text-xs text-muted-foreground whitespace-pre-wrap max-h-96 overflow-y-auto">
                {analysis.raw_text_preview}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
