import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Cpu, 
  FileText, 
  Map, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Clock,
  BookOpen
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-gradient-to-b from-indigo-50/50 via-background to-background dark:from-indigo-950/20 dark:via-background dark:to-background">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-spin-slow" />
            Next-Gen Career Intelligence Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight sm:leading-none">
            Bridge the Gap Between <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500">
              Your Resume
            </span>{" "}
            and{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Your Dream Role
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop guessing why recruiters pass on your application. Upload your PDF resume, benchmark against real industry job requirements, unlock deterministic match scores, and execute a personalized learning roadmap.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/resume"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 group transition-all"
            >
              Start Free Resume Analysis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/target-job"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-xl border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center gap-2 transition-colors"
            >
              Explore 15+ Job Roles
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              100% Free for Students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Transparent 0–100 Scoring Formula
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Curated Educational Resources
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Sample Analysis Feature (Clearly Labeled Sample Data) */}
      <section className="py-16 bg-muted/30 border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-1">
                Interactive Demonstration — Sample Data
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                How CareerGap Evaluates Candidates
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View Full Live Dashboard <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Target Role Benchmark</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">AI Engineer</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-black tracking-tight text-foreground">78.5</span>
                  <span className="text-lg font-medium text-muted-foreground">/ 100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 mb-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" style={{ width: "78.5%" }} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Formula: 80% Required Coverage (82.5%) + 20% Preferred Coverage (62.5%). Fully explainable from extracted evidence.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Strong Core Foundations</span>
                <span className="text-muted-foreground">4 Matched • 2 Gaps</span>
              </div>
            </div>

            {/* Matched vs Missing */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-500" />
                Verified Skill Provenance
              </h3>
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center justify-between font-semibold text-emerald-700 dark:text-emerald-400">
                    <span>Python (Core Language)</span>
                    <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">Match (1.0)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                    Page 1: "Built a distributed data pipeline using Python & asyncio"
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center justify-between font-semibold text-emerald-700 dark:text-emerald-400">
                    <span>PyTorch & ML</span>
                    <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">Match (1.0)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                    Page 1: "Trained transformer classifier with PyTorch"
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                  <div className="flex items-center justify-between font-semibold text-rose-700 dark:text-rose-400">
                    <span>FastAPI (API Serving)</span>
                    <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded">Not Detected (0.0)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Gap Priority #1: Essential for real-time model inference endpoints.
                  </p>
                </div>
              </div>
            </div>

            {/* Generated Action Roadmap */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Map className="h-4 w-4 text-blue-500" />
                  Personalized Roadmap Preview
                </h3>
                <div className="space-y-3">
                  <div className="text-xs">
                    <span className="font-semibold text-foreground">Phase 1: Foundations & API Serving</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      FastAPI official tutorial + build inference microservice (15h)
                    </p>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-foreground">Phase 2: Vector Search & LLMs</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Implement hybrid RAG with PostgreSQL pgvector (20h)
                    </p>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-foreground">Phase 3: Portfolio Capstone</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Deploy Dockerized multi-agent system to cloud with CI/CD
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60">
                <Link
                  href="/roadmap"
                  className="w-full block text-center py-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                >
                  Generate Your Roadmap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            System Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-foreground mt-2">
            How CareerGap AI Works
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            An explainable pipeline designed for students and career transitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-semibold text-base text-foreground mb-2">Upload Resume</h3>
            <p className="text-xs text-muted-foreground">
              Secure PDF ingestion with PyMuPDF, verifying file headers, page count, and textual evidence.
            </p>
          </div>

          <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-semibold text-base text-foreground mb-2">Target Role</h3>
            <p className="text-xs text-muted-foreground">
              Choose from 15 pre-seeded engineering roles or paste any custom job description to extract requirements.
            </p>
          </div>

          <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-semibold text-base text-foreground mb-2">Calculate Alignment</h3>
            <p className="text-xs text-muted-foreground">
              Deterministic weighted formula evaluates required vs preferred coverage with proof for every percentage.
            </p>
          </div>

          <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-semibold text-base text-foreground mb-2">Personalized Roadmap</h3>
            <p className="text-xs text-muted-foreground">
              Receive structured phases, realistic weekly hours, deliverables, and verified official learning resources.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 bg-muted/20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-foreground mt-2">
              Built for Practical Skill Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Exact Line Provenance</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every extracted skill cites the exact sentence excerpt and page number where it appeared in your PDF. Never hallucinated.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Deterministic Scoring</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No black-box guesses. Scores follow strict weighted formulas separating non-negotiable requirements from bonuses.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Curated Resources Only</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Linked directly to official tutorials (Python docs, MDN, FastAPI docs, PyTorch blitz), eliminating hallucinated URLs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Adaptive Weekly Study Hours</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Whether you have 5 hours or 20 hours a week, milestones dynamically adjust to prevent burnout and ensure real progress.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Prerequisite Awareness</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Roadmaps enforce learning order: you master JavaScript before TypeScript, Docker before Kubernetes, and Python before PyTorch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Client Privacy & Data Deletion</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Delete your uploaded resumes and extracted records anytime with 1-click. No hidden secondary retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Clear answers on scoring transparency, privacy, and how CareerGap AI functions.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-indigo-500" />
              How is the job match score calculated?
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              We compute required coverage as 100 × SUM(weight × match value) / SUM(weight) and preferred coverage separately. Match values are 1.0 for verified/confirmed skills, 0.5 for partial evidence, and 0.0 for not detected. The final score combines 80% required coverage and 20% preferred coverage.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-indigo-500" />
              Does CareerGap AI guarantee employment?
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              No. CareerGap AI is an educational career intelligence and learning platform. A match score represents technical alignment between your written resume evidence and job requirements; hiring decisions involve interview performance, culture fit, and portfolio demonstrations.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-indigo-500" />
              Can I edit skills if the parser missed something?
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Yes. You have full edit controls over extracted skills and proficiencies. You can confirm skills, add missing certifications, and instantly recalculate your score and roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Ready to Take Control of Your Career Trajectory?
          </h2>
          <p className="mt-3 text-indigo-100 text-sm max-w-xl mx-auto">
            Upload your resume now to receive immediate, transparent feedback and a tailored learning roadmap.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/resume"
              className="px-8 py-3 text-sm font-semibold rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 shadow-md transition-colors"
            >
              Analyze Your Resume Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
