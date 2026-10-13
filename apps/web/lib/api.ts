/**
 * Typed API Client for CareerGap AI Web Application
 * Connects Next.js Frontend with the Python FastAPI Intelligence Backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

export interface ExtractedSkill {
  canonical_name: string;
  category: string;
  evidence: string;
  evidence_type: string;
  confidence: number;
  proficiency: string;
  years_experience?: number | null;
  source_page: number;
  user_confirmed: boolean;
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  source_page: number;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  duration?: string | null;
  description: string;
  technologies: string[];
  source_page: number;
}

export interface EducationItem {
  degree: string;
  institution: string;
  graduation_year?: string | null;
  source_page: number;
}

export interface ResumeAnalysisResponse {
  resume_id: string;
  summary: string;
  page_count: number;
  char_count: number;
  skills: ExtractedSkill[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: any[];
  raw_text_preview: string;
  provider_used: string;
  ocr_applied: boolean;
}

export interface JobSkillRequirement {
  canonical_name: string;
  category: string;
  is_required: boolean;
  weight: number;
  description: string;
  prerequisites: string[];
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  category: string;
  required_skills: JobSkillRequirement[];
  preferred_skills: JobSkillRequirement[];
  suggested_projects: string[];
}

export interface JobDescriptionAnalysis {
  job_id: string;
  job_title: string;
  company_name?: string | null;
  responsibilities: string[];
  required_skills: JobSkillRequirement[];
  preferred_skills: JobSkillRequirement[];
  qualifications: string[];
  tools: string[];
}

export interface MatchItem {
  canonical_name: string;
  category: string;
  is_required: boolean;
  weight: number;
  match_status: "matched" | "partial" | "not_detected" | "unconfirmed";
  match_value: number;
  evidence?: string | null;
  confidence: number;
  explanation: string;
  source_page?: number | null;
  user_confirmed: boolean;
}

export interface SkillGap {
  canonical_name: string;
  category: string;
  is_required: boolean;
  importance_weight: number;
  why_it_matters: string;
  current_evidence?: string | null;
  recommended_target: string;
  suggested_action: string;
  estimated_effort_hours: number;
  prerequisites: string[];
  priority_rank: number;
}

export interface MatchReport {
  match_id: string;
  role_title: string;
  overall_score: number;
  required_coverage: number;
  preferred_coverage: number;
  required_weight_sum: number;
  preferred_weight_sum: number;
  items: MatchItem[];
  matched_skills_count: number;
  partial_skills_count: number;
  missing_required_count: number;
  missing_preferred_count: number;
  skill_gaps: SkillGap[];
  limitations_disclaimer: string;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  skill_tags: string[];
  resource_type: string;
  difficulty: string;
  duration_hours: number;
  price_category: string;
  url: string;
  verified: boolean;
}

export interface RoadmapTask {
  id: string;
  phase_id: string;
  title: string;
  description: string;
  target_skill: string;
  deliverable: string;
  estimated_hours: number;
  is_completed: boolean;
  resources: LearningResource[];
}

export interface RoadmapPhase {
  id: string;
  phase_number: number;
  title: string;
  description: string;
  estimated_weeks: number;
  tasks: RoadmapTask[];
}

export interface Roadmap {
  id: string;
  title: string;
  target_role: string;
  estimated_duration_weeks: number;
  weekly_hours: number;
  total_estimated_hours: number;
  phases: RoadmapPhase[];
  completed_tasks_count: number;
  total_tasks_count: number;
}

// Network Request Helper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errMsg = `API request failed with status ${res.status}`;
      try {
        const errorData = await res.json();
        errMsg = errorData.detail || errorData.error || errMsg;
      } catch {
        // use default error message
      }
      throw new Error(errMsg);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`Fetch error at ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Resumes
  async uploadResume(file: File): Promise<ResumeAnalysisResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<ResumeAnalysisResponse>("/api/resumes", {
      method: "POST",
      body: formData,
    });
  },

  async listResumes(): Promise<any[]> {
    return apiFetch<any[]>("/api/resumes");
  },

  async getResumeAnalysis(resumeId: string): Promise<ResumeAnalysisResponse> {
    return apiFetch<ResumeAnalysisResponse>(`/api/resumes/${resumeId}/analysis`);
  },

  async updateSkills(resumeId: string, skills: ExtractedSkill[]): Promise<ResumeAnalysisResponse> {
    return apiFetch<ResumeAnalysisResponse>(`/api/resumes/${resumeId}/skills`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills }),
    });
  },

  async deleteResume(resumeId: string): Promise<{ deleted: boolean; resume_id: string }> {
    return apiFetch<{ deleted: boolean; resume_id: string }>(`/api/resumes/${resumeId}`, {
      method: "DELETE",
    });
  },

  // Job Roles
  async listJobRoles(query?: string, category?: string): Promise<JobRole[]> {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (category) params.append("category", category);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<JobRole[]>(`/api/job-roles${qs}`);
  },

  async getJobRole(roleId: string): Promise<JobRole> {
    return apiFetch<JobRole>(`/api/job-roles/${roleId}`);
  },

  // Job Descriptions
  async parseJobDescription(payload: {
    raw_text: string;
    job_title?: string;
    company_name?: string;
  }): Promise<JobDescriptionAnalysis> {
    return apiFetch<JobDescriptionAnalysis>("/api/job-descriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async updateJobRequirements(
    jobId: string,
    payload: {
      required_skills: JobSkillRequirement[];
      preferred_skills: JobSkillRequirement[];
    }
  ): Promise<JobDescriptionAnalysis> {
    return apiFetch<JobDescriptionAnalysis>(`/api/job-descriptions/${jobId}/requirements`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  // Matching
  async createMatchReport(payload: {
    role_id?: string;
    job_id?: string;
    resume_id?: string;
    candidate_skills?: ExtractedSkill[];
    custom_role_title?: string;
    custom_requirements?: JobSkillRequirement[];
  }): Promise<MatchReport> {
    return apiFetch<MatchReport>("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async listMatchReports(): Promise<MatchReport[]> {
    return apiFetch<MatchReport[]>("/api/matches");
  },

  async getMatchReport(matchId: string): Promise<MatchReport> {
    return apiFetch<MatchReport>(`/api/matches/${matchId}`);
  },

  // Roadmaps
  async createRoadmapFromMatch(payload: {
    match_id: string;
    weekly_hours?: number;
    target_timeline_weeks?: number;
    learning_preference?: string;
  }): Promise<Roadmap> {
    return apiFetch<Roadmap>("/api/roadmaps/from-match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async listRoadmaps(): Promise<Roadmap[]> {
    return apiFetch<Roadmap[]>("/api/roadmaps");
  },

  async getRoadmap(roadmapId: string): Promise<Roadmap> {
    return apiFetch<Roadmap>(`/api/roadmaps/${roadmapId}`);
  },

  async toggleRoadmapTask(
    roadmapId: string,
    taskId: string,
    isCompleted: boolean
  ): Promise<Roadmap> {
    return apiFetch<Roadmap>(`/api/roadmaps/${roadmapId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_completed: isCompleted }),
    });
  },

  // Resources
  async listResources(filters?: {
    skill?: string;
    difficulty?: string;
    price?: string;
  }): Promise<LearningResource[]> {
    const params = new URLSearchParams();
    if (filters?.skill) params.append("skill", filters.skill);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.price) params.append("price", filters.price);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<LearningResource[]>(`/api/resources${qs}`);
  },

  async getBookmarks(): Promise<any[]> {
    return apiFetch<any[]>("/api/resources/bookmarks/all");
  },

  async createBookmark(resourceId: string, notes?: string): Promise<any> {
    return apiFetch<any>("/api/resources/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource_id: resourceId, notes }),
    });
  },

  async deleteBookmark(bookmarkId: string): Promise<any> {
    return apiFetch<any>(`/api/resources/bookmarks/${bookmarkId}`, {
      method: "DELETE",
    });
  },
};
