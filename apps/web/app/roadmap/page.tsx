"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Map, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  BookOpen, 
  RefreshCw, 
  ChevronRight,
  Bookmark,
  Layers,
  Award,
  Sliders
} from "lucide-react";
import { api, Roadmap, RoadmapPhase, RoadmapTask } from "@/lib/api";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  useEffect(() => {
    async function loadRoadmap() {
      setIsLoading(true);
      try {
        const matchId = localStorage.getItem("careergap_match_id");
        const storedRoadmapStr = localStorage.getItem("careergap_latest_roadmap");

        if (storedRoadmapStr) {
          setRoadmap(JSON.parse(storedRoadmapStr));
          setIsLoading(false);
          return;
        }

        if (matchId) {
          const generated = await api.createRoadmapFromMatch({
            match_id: matchId,
            weekly_hours: weeklyHours,
          });
          setRoadmap(generated);
          localStorage.setItem("careergap_latest_roadmap", JSON.stringify(generated));
        } else {
          // Generate fallback roadmap for AI Engineer
          const matchReportStr = localStorage.getItem("careergap_latest_match");
          const gaps = matchReportStr ? JSON.parse(matchReportStr).skill_gaps : [];
          const generated = await api.createRoadmapFromMatch({
            match_id: "match_demo",
            weekly_hours: 10,
          }).catch(() => null);

          if (generated) {
            setRoadmap(generated);
            localStorage.setItem("careergap_latest_roadmap", JSON.stringify(generated));
          }
        }
      } catch (e) {
        console.error("Roadmap generation error:", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadRoadmap();
  }, []);

  const handleToggleTask = async (phaseId: string, taskId: string, currentCompleted: boolean) => {
    if (!roadmap) return;

    // Optimistically toggle task completion
    const updatedPhases = roadmap.phases.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === taskId ? { ...task, is_completed: !currentCompleted } : task
          ),
        };
      }
      return phase;
    });

    const completedCount = updatedPhases.reduce(
      (sum, p) => sum + p.tasks.filter((t) => t.is_completed).length,
      0
    );

    const updatedRoadmap = {
      ...roadmap,
      phases: updatedPhases,
      completed_tasks_count: completedCount,
    };

    setRoadmap(updatedRoadmap);
    localStorage.setItem("careergap_latest_roadmap", JSON.stringify(updatedRoadmap));

    // Persist to backend if API supports
    try {
      await api.toggleRoadmapTask(roadmap.id, taskId, !currentCompleted);
    } catch {
      // offline / local fallback
    }
  };

  const handleRegenerateWithHours = async (newHours: number) => {
    setWeeklyHours(newHours);
    if (!roadmap) return;
    setIsLoading(true);

    try {
      const matchId = localStorage.getItem("careergap_match_id");
      if (matchId) {
        const regenerated = await api.createRoadmapFromMatch({
          match_id: matchId,
          weekly_hours: newHours,
        });
        setRoadmap(regenerated);
        localStorage.setItem("careergap_latest_roadmap", JSON.stringify(regenerated));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-foreground">Assembling Personalized Roadmap...</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Sequencing prerequisite skills, estimating milestones, and attaching verified learning resources.
        </p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-foreground">No Active Roadmap</h2>
        <p className="text-xs text-muted-foreground mt-2 mb-4">
          Please run a skill gap match analysis first to generate your custom timeline.
        </p>
        <Link
          href="/target-job"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
        >
          Select Target Job
        </Link>
      </div>
    );
  }

  const completionPercentage = roadmap.total_tasks_count > 0
    ? Math.round((roadmap.completed_tasks_count / roadmap.total_tasks_count) * 100)
    : 0;

  const activePhase = roadmap.phases[activePhaseIndex] || roadmap.phases[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Personalized Execution Plan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            {roadmap.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tailored learning path addressing your identified skill gaps at {roadmap.weekly_hours} hours/week.
          </p>
        </div>

        {/* Weekly Hours Adjuster */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-card self-start md:self-auto">
          <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
          <div className="text-xs">
            <span className="text-muted-foreground block text-[10px]">Study Pace</span>
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              {[5, 10, 15, 20].map((h) => (
                <button
                  key={h}
                  onClick={() => handleRegenerateWithHours(h)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    weeklyHours === h
                      ? "bg-indigo-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {h}h/wk
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium block">Total Duration</span>
          <span className="text-2xl font-black text-foreground">{roadmap.estimated_duration_weeks} Weeks</span>
          <span className="text-[10px] text-muted-foreground block mt-0.5">Approx. realistic timeline</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium block">Estimated Effort</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{roadmap.total_estimated_hours} Hours</span>
          <span className="text-[10px] text-muted-foreground block mt-0.5">Hands-on practice & docs</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium block">Roadmap Phases</span>
          <span className="text-2xl font-black text-foreground">{roadmap.phases.length} Phases</span>
          <span className="text-[10px] text-muted-foreground block mt-0.5">Milestone structured</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[11px] text-muted-foreground font-medium block">Task Progress</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{completionPercentage}%</span>
            <span className="text-xs text-muted-foreground">({roadmap.completed_tasks_count}/{roadmap.total_tasks_count})</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-border gap-2 pb-px text-xs font-bold scrollbar-none">
        {roadmap.phases.map((phase, idx) => {
          const isActive = activePhaseIndex === idx;
          const phaseTasksCompleted = phase.tasks.filter((t) => t.is_completed).length;
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhaseIndex(idx)}
              className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground"
              }`}>
                {phase.phase_number}
              </span>
              <span>{phase.title}</span>
              <span className="text-[10px] font-normal text-muted-foreground">
                ({phaseTasksCompleted}/{phase.tasks.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Phase Details & Task List */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h2 className="text-lg font-bold text-foreground">
              Phase {activePhase.phase_number}: {activePhase.title}
            </h2>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
              Estimated Duration: ~{activePhase.estimated_weeks} Weeks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {activePhase.description}
          </p>
        </div>

        {/* Task Cards */}
        <div className="space-y-4">
          {activePhase.tasks.map((task) => (
            <div
              key={task.id}
              className={`p-6 rounded-2xl border transition-all ${
                task.is_completed
                  ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                  : "border-border bg-card shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggleTask(activePhase.id, task.id, task.is_completed)}
                    className="mt-0.5 text-muted-foreground hover:text-indigo-600 transition-colors"
                  >
                    {task.is_completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/60" />
                    )}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-sm font-bold ${
                        task.is_completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}>
                        {task.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-indigo-500/10 text-indigo-600">
                        {task.target_skill}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.estimated_hours}h
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {task.description}
                    </p>

                    <div className="pt-2 text-xs">
                      <span className="font-semibold text-foreground">Deliverable: </span>
                      <span className="text-muted-foreground">{task.deliverable}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleTask(activePhase.id, task.id, task.is_completed)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    task.is_completed
                      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                      : "bg-muted text-muted-foreground hover:bg-indigo-600 hover:text-white"
                  }`}
                >
                  {task.is_completed ? "Completed ✓" : "Mark Done"}
                </button>
              </div>

              {/* Verified Learning Resources Attached to Task */}
              {task.resources && task.resources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                    Curated Learning Resources & Documentation
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {task.resources.map((res) => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/40 transition-colors flex items-center justify-between group"
                      >
                        <div className="space-y-0.5 pr-2">
                          <span className="text-xs font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block line-clamp-1">
                            {res.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            {res.provider} • {res.resource_type} • {res.price_category}
                          </span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-indigo-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
