"""Custom Job Description Parsing and Requirement Extraction API Router."""

import re
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.models.schemas import (
    JobDescriptionParseRequest,
    JobDescriptionAnalysis,
    JobSkillRequirement,
    SkillCategory,
)
from app.services.taxonomy import (
    SKILL_TAXONOMY,
    ALIAS_TO_CANONICAL,
    normalize_skill_name,
)

router = APIRouter(prefix="/job-descriptions", tags=["Job Descriptions"])

STORED_JOB_DESCRIPTIONS: dict[str, JobDescriptionAnalysis] = {}


class RequirementUpdateRequest(BaseModel):
    required_skills: list[JobSkillRequirement]
    preferred_skills: list[JobSkillRequirement]


def parse_job_description_text(
    raw_text: str,
    job_title: Optional[str] = None,
    company_name: Optional[str] = None,
) -> JobDescriptionAnalysis:
    """Extract structured job requirements, responsibilities, and skills from raw text."""
    if not raw_text or len(raw_text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Job description text is too short or empty. Please provide detailed job requirements.",
        )

    job_id = f"job_{uuid.uuid4().hex[:10]}"
    inferred_title = job_title or "Target Position"
    lines = raw_text.splitlines()

    # Try inferring job title from first line if not provided
    if not job_title and lines:
        first_line = lines[0].strip()
        if 5 <= len(first_line) <= 50 and not any(w in first_line.lower() for w in ["requirement", "description", "responsibilities"]):
            inferred_title = first_line

    # Split into sections if present
    req_skills_map: dict[str, JobSkillRequirement] = {}
    pref_skills_map: dict[str, JobSkillRequirement] = {}
    responsibilities: list[str] = []
    qualifications: list[str] = []

    current_mode = "required"  # default to required

    for line in lines:
        clean = line.strip()
        if not clean:
            continue
        lower_line = clean.lower()

        # Check section transitions
        if any(w in lower_line for w in ["nice to have", "preferred", "bonus", "plus", "desirable"]):
            current_mode = "preferred"
        elif any(w in lower_line for w in ["required", "must have", "minimum qualification", "qualifications", "what you need"]):
            current_mode = "required"
        elif any(w in lower_line for w in ["responsibilities", "what you will do", "duties"]):
            current_mode = "responsibilities"

        # Capture bullet points as responsibilities
        if current_mode == "responsibilities" and (clean.startswith(("-", "*", "•")) or len(clean) > 30):
            responsibilities.append(clean.lstrip("-*• ").strip())

        # Scan line for taxonomy skills
        for alias, canonical in ALIAS_TO_CANONICAL.items():
            pattern = r"(?:\b|_)" + re.escape(alias) + r"(?:\b|_)"
            if re.search(pattern, lower_line, re.IGNORECASE):
                tax_data = SKILL_TAXONOMY.get(canonical, {})
                cat = tax_data.get("category", SkillCategory.OTHER)

                # Assign appropriate weight
                weight = 1.3 if current_mode == "required" else 0.8

                skill_req = JobSkillRequirement(
                    canonical_name=canonical,
                    category=cat,
                    is_required=(current_mode == "required"),
                    weight=weight,
                    description=f"Extracted from context: '{clean[:100]}'",
                    prerequisites=tax_data.get("prerequisites", []),
                )

                if current_mode == "required":
                    req_skills_map[canonical] = skill_req
                else:
                    pref_skills_map[canonical] = skill_req

    # Deduplicate: if skill is in required, remove from preferred
    for k in req_skills_map:
        if k in pref_skills_map:
            del pref_skills_map[k]

    # If no required skills were detected, fall back to general software engineering requirements
    if not req_skills_map and not pref_skills_map:
        req_skills_map["Python"] = JobSkillRequirement(
            canonical_name="Python",
            weight=1.0,
            is_required=True,
            description="Core general development requirement inferred from context.",
        )
        req_skills_map["Git"] = JobSkillRequirement(
            canonical_name="Git",
            weight=1.0,
            is_required=True,
            description="Standard version control requirement inferred from context.",
        )

    analysis = JobDescriptionAnalysis(
        job_id=job_id,
        job_title=inferred_title,
        company_name=company_name or "Target Employer",
        responsibilities=responsibilities[:6],
        required_skills=list(req_skills_map.values()),
        preferred_skills=list(pref_skills_map.values()),
        qualifications=qualifications,
        tools=[s.canonical_name for s in list(req_skills_map.values()) + list(pref_skills_map.values())],
    )

    STORED_JOB_DESCRIPTIONS[job_id] = analysis
    return analysis


@router.post("", response_model=JobDescriptionAnalysis, status_code=status.HTTP_201_CREATED)
async def analyze_job_description(payload: JobDescriptionParseRequest):
    """Analyze raw job description text to extract required skills, preferred skills, and responsibilities."""
    return parse_job_description_text(
        raw_text=payload.raw_text,
        job_title=payload.job_title,
        company_name=payload.company_name,
    )


@router.get("/{job_id}", response_model=JobDescriptionAnalysis)
async def get_job_description(job_id: str):
    """Retrieve existing parsed job description analysis."""
    if job_id not in STORED_JOB_DESCRIPTIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job description with ID '{job_id}' not found.",
        )
    return STORED_JOB_DESCRIPTIONS[job_id]


@router.patch("/{job_id}/requirements", response_model=JobDescriptionAnalysis)
async def update_job_requirements(job_id: str, payload: RequirementUpdateRequest):
    """Allow user to manually edit and customize extracted required and preferred job requirements."""
    if job_id not in STORED_JOB_DESCRIPTIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job description with ID '{job_id}' not found.",
        )
    existing = STORED_JOB_DESCRIPTIONS[job_id]
    existing.required_skills = payload.required_skills
    existing.preferred_skills = payload.preferred_skills
    STORED_JOB_DESCRIPTIONS[job_id] = existing
    return existing
