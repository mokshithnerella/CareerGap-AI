"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Layers,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [careerStage, setCareerStage] = useState("Undergraduate Student");
  const [targetInterest, setTargetInterest] = useState("AI Engineer");
  const [experienceLevel, setExperienceLevel] = useState("entry");
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [targetTimeline, setTargetTimeline] = useState(10);
  const [learningPreference, setLearningPreference] = useState("hands_on_projects");

  const handleSave = () => {
    const preferences = {
      careerStage,
      targetInterest,
      experienceLevel,
      weeklyHours,
      targetTimeline,
      learningPreference,
      onboardingCompleted: true,
    };
    localStorage.setItem("careergap_user_preferences", JSON.stringify(preferences));
    router.push("/resume");
  };

  const handleSkip = () => {
    router.push("/resume");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          Step 1 of 3: Personalized Study Profile
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Tailor Your Career Intelligence Experience
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          Tell us about your learning availability and career goals. We calibrate roadmaps to your realistic study budget.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-8 text-xs">
        {/* Stage & Target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              Current Education or Career Stage
            </label>
            <select
              value={careerStage}
              onChange={(e) => setCareerStage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Undergraduate Student">Undergraduate Student</option>
              <option value="Graduate / Master's Student">Graduate / Master's Student</option>
              <option value="Recent Graduate">Recent Graduate (Entry Level)</option>
              <option value="Career Transitioner">Career Transitioner (Switching to Tech)</option>
              <option value="Self-Taught Developer">Self-Taught Developer / Bootcamper</option>
              <option value="Junior Software Engineer">Junior Software Engineer (1-2 yrs)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-600" />
              Primary Target Career Track
            </label>
            <select
              value={targetInterest}
              onChange={(e) => setTargetInterest(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-indigo-500"
            >
              <option value="AI Engineer">AI Engineer / Generative AI</option>
              <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Full-Stack Developer">Full-Stack Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="DevOps Engineer">DevOps & Cloud Engineer</option>
              <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
            </select>
          </div>
        </div>

        {/* Pacing Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/80">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-600" />
                Weekly Available Study Time
              </label>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md">
                {weeklyHours} hrs / week
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={35}
              step={1}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Realistic pacing prevents burnout. Typical student schedule: 8–15 hrs/wk.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-600" />
                Target Preparation Timeline
              </label>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md">
                {targetTimeline} weeks (~{Math.round(targetTimeline / 4)} months)
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={24}
              step={2}
              value={targetTimeline}
              onChange={(e) => setTargetTimeline(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Estimated total learning allocation: {weeklyHours * targetTimeline} hours.
            </p>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="pt-4 border-t border-border/80">
          <label className="block font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            Preferred Learning Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "hands_on_projects", label: "Project-Centric", desc: "Build capstones & code repos" },
              { id: "official_docs", label: "Documentation & Theory", desc: "Official guides & deep specs" },
              { id: "interactive_practice", label: "Interactive Exercises", desc: "Step-by-step coding labs" },
            ].map((pref) => (
              <div
                key={pref.id}
                onClick={() => setLearningPreference(pref.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  learningPreference === pref.id
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-foreground ring-1 ring-indigo-600"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="font-semibold text-xs text-foreground mb-1">{pref.label}</div>
                <div className="text-[11px] text-muted-foreground">{pref.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-border/80">
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground font-medium underline-offset-4 hover:underline cursor-pointer"
          >
            Skip for Now (Use Defaults)
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            Save Profile & Upload Resume <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
