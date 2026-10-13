"""Job-Matching and Transparent Scoring API Router."""

import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.models.schemas import (
    MatchReport,
    ExtractedSkill,
    JobSkillRequirement,
)
from app.services.matcher import compute_match_report
from app.services.taxonomy import SEED_JOB_ROLES
from app.api.resumes import STORED_ANALYSES
from app.api.job_descriptions import STORED_JOB_DESCRIPTIONS

router = APIRouter(prefix="/matches", tags=["Matching & Scoring"])

STORED_MATCH_REPORTS: dict[str, MatchReport] = {}


class MatchRequest(BaseModel):
    role_id: Optional[str] = None
    job_id: Optional[str] = None
    resume_id: Optional[str] = None
    candidate_skills: Optional[list[ExtractedSkill]] = None
    custom_role_title: Optional[str] = None
    custom_requirements: Optional[list[JobSkillRequirement]] = None


@router.post("", response_model=MatchReport, status_code=status.HTTP_201_CREATED)
async def generate_match_report(payload: MatchRequest):
    """Compute transparent, reproducible match report and prioritized skill gaps."""
    # 1. Resolve candidate skills
    candidate_skills: list[ExtractedSkill] = []
    if payload.candidate_skills:
        candidate_skills = payload.candidate_skills
    elif payload.resume_id:
        if payload.resume_id not in STORED_ANALYSES:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resume analysis for ID '{payload.resume_id}' not found.",
            )
        candidate_skills = STORED_ANALYSES[payload.resume_id].skills
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'resume_id' or 'candidate_skills' must be provided.",
        )

    # 2. Resolve job requirements & role title
    role_title = payload.custom_role_title or "Target Position"
    requirements: list[JobSkillRequirement] = []

    if payload.role_id:
        matched_role = next((r for r in SEED_JOB_ROLES if r.id == payload.role_id), None)
        if not matched_role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Job role with ID '{payload.role_id}' not found.",
            )
        role_title = matched_role.title
        requirements = matched_role.required_skills + matched_role.preferred_skills
    elif payload.job_id:
        if payload.job_id not in STORED_JOB_DESCRIPTIONS:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Job description with ID '{payload.job_id}' not found.",
            )
        job_desc = STORED_JOB_DESCRIPTIONS[payload.job_id]
        role_title = job_desc.job_title
        requirements = job_desc.required_skills + job_desc.preferred_skills
    elif payload.custom_requirements:
        requirements = payload.custom_requirements
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'role_id', 'job_id', or 'custom_requirements' must be provided.",
        )

    if not requirements:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No job requirements were found to evaluate.",
        )

    # 3. Compute deterministic score
    report = compute_match_report(
        role_title=role_title,
        requirements=requirements,
        candidate_skills=candidate_skills,
    )

    STORED_MATCH_REPORTS[report.match_id] = report
    return report


@router.get("", response_model=list[MatchReport])
async def list_match_reports():
    """List historical match reports."""
    return list(STORED_MATCH_REPORTS.values())


@router.get("/{match_id}", response_model=MatchReport)
async def get_match_report(match_id: str):
    """Retrieve full details, formulas, and evidence for a specific match report."""
    if match_id not in STORED_MATCH_REPORTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match report with ID '{match_id}' not found.",
        )
    return STORED_MATCH_REPORTS[match_id]
