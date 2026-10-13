"""Personalized Roadmap Generation and Progress Tracking API Router."""

from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.models.schemas import (
    Roadmap,
    RoadmapGenerateRequest,
    RoadmapTask,
    SkillGap,
)
from app.services.roadmap_generator import generate_personalized_roadmap
from app.api.matches import STORED_MATCH_REPORTS

router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])

STORED_ROADMAPS: dict[str, Roadmap] = {}


class RoadmapTaskToggleRequest(BaseModel):
    is_completed: bool


class RoadmapFromMatchRequest(BaseModel):
    match_id: str
    weekly_hours: int = 10
    target_timeline_weeks: int = 12
    learning_preference: str = "hands_on_projects"


@router.post("", response_model=Roadmap, status_code=status.HTTP_201_CREATED)
async def create_roadmap(payload: RoadmapGenerateRequest):
    """Generate personalized week-by-week learning roadmap from skill gaps."""
    roadmap = generate_personalized_roadmap(
        role_title=payload.role_title,
        candidate_skills=payload.candidate_skills,
        skill_gaps=payload.skill_gaps,
        weekly_hours=payload.weekly_hours,
        target_timeline_weeks=payload.target_timeline_weeks,
        learning_preference=payload.learning_preference,
    )
    STORED_ROADMAPS[roadmap.id] = roadmap
    return roadmap


@router.post("/from-match", response_model=Roadmap, status_code=status.HTTP_201_CREATED)
async def create_roadmap_from_match(payload: RoadmapFromMatchRequest):
    """Generate roadmap directly from an existing match report ID."""
    if payload.match_id not in STORED_MATCH_REPORTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match report with ID '{payload.match_id}' not found.",
        )
    match_report = STORED_MATCH_REPORTS[payload.match_id]
    candidate_skills = [
        item.canonical_name for item in match_report.items if item.match_status.value == "matched"
    ]

    roadmap = generate_personalized_roadmap(
        role_title=match_report.role_title,
        candidate_skills=candidate_skills,
        skill_gaps=match_report.skill_gaps,
        weekly_hours=payload.weekly_hours,
        target_timeline_weeks=payload.target_timeline_weeks,
        learning_preference=payload.learning_preference,
    )
    STORED_ROADMAPS[roadmap.id] = roadmap
    return roadmap


@router.get("", response_model=list[Roadmap])
async def list_roadmaps():
    """List all active and completed learning roadmaps."""
    return list(STORED_ROADMAPS.values())


@router.get("/{roadmap_id}", response_model=Roadmap)
async def get_roadmap(roadmap_id: str):
    """Retrieve full phase and task details for a roadmap."""
    if roadmap_id not in STORED_ROADMAPS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Roadmap with ID '{roadmap_id}' not found.",
        )
    return STORED_ROADMAPS[roadmap_id]


@router.patch("/{roadmap_id}/tasks/{task_id}", response_model=Roadmap)
async def toggle_task_completion(roadmap_id: str, task_id: str, payload: RoadmapTaskToggleRequest):
    """Update task completion status and recalculate roadmap progress."""
    if roadmap_id not in STORED_ROADMAPS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Roadmap with ID '{roadmap_id}' not found.",
        )

    roadmap = STORED_ROADMAPS[roadmap_id]
    task_found = False

    for phase in roadmap.phases:
        for task in phase.tasks:
            if task.id == task_id:
                task.is_completed = payload.is_completed
                task_found = True
                break
        if task_found:
            break

    if not task_found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found in roadmap.",
        )

    # Recalculate completed count
    completed_count = sum(
        1 for p in roadmap.phases for t in p.tasks if t.is_completed
    )
    roadmap.completed_tasks_count = completed_count
    STORED_ROADMAPS[roadmap_id] = roadmap
    return roadmap


@router.post("/{roadmap_id}/regenerate", response_model=Roadmap)
async def regenerate_roadmap(roadmap_id: str, payload: RoadmapGenerateRequest):
    """Regenerate an existing roadmap with updated hours or timeline."""
    if roadmap_id not in STORED_ROADMAPS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Roadmap with ID '{roadmap_id}' not found.",
        )
    
    new_roadmap = generate_personalized_roadmap(
        role_title=payload.role_title,
        candidate_skills=payload.candidate_skills,
        skill_gaps=payload.skill_gaps,
        weekly_hours=payload.weekly_hours,
        target_timeline_weeks=payload.target_timeline_weeks,
        learning_preference=payload.learning_preference,
        roadmap_id=roadmap_id,
    )
    STORED_ROADMAPS[roadmap_id] = new_roadmap
    return new_roadmap
