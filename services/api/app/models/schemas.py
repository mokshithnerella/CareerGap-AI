"""Pydantic schemas and contracts for CareerGap AI."""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class EvidenceType(str, Enum):
    PROJECT = "project"
    WORK_EXPERIENCE = "work_experience"
    INTERNSHIP = "internship"
    EDUCATION = "education"
    CERTIFICATION = "certification"
    SKILLS_SECTION = "skills_section"
    OTHER = "other"


class MatchStatus(str, Enum):
    MATCHED = "matched"
    PARTIAL = "partial"
    NOT_DETECTED = "not_detected"
    UNCONFIRMED = "unconfirmed"


class SkillCategory(str, Enum):
    PROGRAMMING_LANGUAGE = "programming_language"
    FRAMEWORK = "framework"
    DATABASE = "database"
    CLOUD_DEVOPS = "cloud_devops"
    AI_ML = "ai_ml"
    DATA_ENGINEERING = "data_engineering"
    SECURITY = "security"
    TESTING_QA = "testing_qa"
    SYSTEM_DESIGN = "system_design"
    SOFT_SKILL = "soft_skill"
    TOOLS = "tools"
    OTHER = "other"


class ExtractedSkill(BaseModel):
    canonical_name: str
    category: SkillCategory = SkillCategory.OTHER
    evidence: str = Field(..., description="Excerpt or context proving where skill was demonstrated")
    evidence_type: EvidenceType = EvidenceType.OTHER
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    proficiency: str = Field(default="unknown", description="beginner | intermediate | advanced | unknown")
    years_experience: Optional[float] = None
    source_page: int = 1
    user_confirmed: bool = False


class ProjectItem(BaseModel):
    title: str
    description: str
    technologies: list[str] = []
    source_page: int = 1


class ExperienceItem(BaseModel):
    role: str
    organization: str
    duration: Optional[str] = None
    description: str = ""
    technologies: list[str] = []
    source_page: int = 1


class EducationItem(BaseModel):
    degree: str
    institution: str
    graduation_year: Optional[str] = None
    source_page: int = 1


class CertificationItem(BaseModel):
    name: str
    issuer: Optional[str] = None
    year: Optional[str] = None
    source_page: int = 1


class ResumeAnalysisResponse(BaseModel):
    resume_id: str
    summary: str
    page_count: int
    char_count: int
    skills: list[ExtractedSkill]
    projects: list[ProjectItem] = []
    experience: list[ExperienceItem] = []
    education: list[EducationItem] = []
    certifications: list[CertificationItem] = []
    raw_text_preview: str = ""
    provider_used: str = "deterministic_fallback"
    ocr_applied: bool = False


class JobSkillRequirement(BaseModel):
    canonical_name: str
    category: SkillCategory = SkillCategory.OTHER
    is_required: bool = True  # True = Required, False = Preferred
    weight: float = 1.0
    description: str = ""
    prerequisites: list[str] = []


class JobRole(BaseModel):
    id: str
    title: str
    description: str
    category: str
    required_skills: list[JobSkillRequirement]
    preferred_skills: list[JobSkillRequirement]
    suggested_projects: list[str] = []
    learning_resources: list[str] = []


class JobDescriptionParseRequest(BaseModel):
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    raw_text: str


class JobDescriptionAnalysis(BaseModel):
    job_id: str
    job_title: str
    company_name: Optional[str] = None
    responsibilities: list[str] = []
    required_skills: list[JobSkillRequirement]
    preferred_skills: list[JobSkillRequirement]
    qualifications: list[str] = []
    tools: list[str] = []


class MatchItem(BaseModel):
    canonical_name: str
    category: SkillCategory = SkillCategory.OTHER
    is_required: bool
    weight: float
    match_status: MatchStatus
    match_value: float  # 1.0, 0.5, 0.0
    evidence: Optional[str] = None
    confidence: float = 0.0
    explanation: str
    source_page: Optional[int] = None
    user_confirmed: bool = False


class SkillGap(BaseModel):
    canonical_name: str
    category: SkillCategory = SkillCategory.OTHER
    is_required: bool
    importance_weight: float
    why_it_matters: str
    current_evidence: Optional[str] = None
    recommended_target: str = "intermediate"
    suggested_action: str
    estimated_effort_hours: int = 20
    prerequisites: list[str] = []
    priority_rank: int = 1


class MatchReport(BaseModel):
    match_id: str
    role_title: str
    overall_score: float  # 0 to 100
    required_coverage: float  # 0 to 100
    preferred_coverage: float  # 0 to 100
    required_weight_sum: float
    preferred_weight_sum: float
    items: list[MatchItem]
    matched_skills_count: int
    partial_skills_count: int
    missing_required_count: int
    missing_preferred_count: int
    skill_gaps: list[SkillGap]
    limitations_disclaimer: str = (
        "This score represents transparent skill alignment between the extracted resume evidence "
        "and stated job requirements. It is an educational indicator and not a hiring decision or employment guarantee."
    )


class LearningResource(BaseModel):
    id: str
    title: str
    provider: str
    skill_tags: list[str]
    resource_type: str  # Official Documentation, Interactive Course, Book, Project Guide
    difficulty: str  # Beginner, Intermediate, Advanced
    duration_hours: int
    price_category: str  # Free, Paid, Freemium
    url: str
    verified: bool = True


class RoadmapTask(BaseModel):
    id: str
    phase_id: str
    title: str
    description: str
    target_skill: str
    deliverable: str
    estimated_hours: int
    is_completed: bool = False
    resources: list[LearningResource] = []


class RoadmapPhase(BaseModel):
    id: str
    phase_number: int
    title: str
    description: str
    estimated_weeks: int
    tasks: list[RoadmapTask]


class Roadmap(BaseModel):
    id: str
    title: str
    target_role: str
    estimated_duration_weeks: int
    weekly_hours: int
    total_estimated_hours: int
    phases: list[RoadmapPhase]
    completed_tasks_count: int = 0
    total_tasks_count: int = 0


class RoadmapGenerateRequest(BaseModel):
    role_title: str
    candidate_skills: list[str]
    skill_gaps: list[SkillGap]
    weekly_hours: int = 10
    target_timeline_weeks: int = 12
    learning_preference: str = "hands_on_projects"  # documentation | interactive | hands_on_projects
