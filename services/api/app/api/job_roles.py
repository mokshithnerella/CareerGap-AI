"""Job Role Library API Router."""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.models.schemas import JobRole
from app.services.taxonomy import SEED_JOB_ROLES

router = APIRouter(prefix="/job-roles", tags=["Job Roles"])


@router.get("", response_model=list[JobRole])
async def list_job_roles(
    q: Optional[str] = Query(None, description="Search query by role title or category"),
    category: Optional[str] = Query(None, description="Filter by role category"),
):
    """Retrieve searchable, extensible job roles from the library."""
    roles = SEED_JOB_ROLES
    if category:
        roles = [r for r in roles if r.category.lower() == category.lower()]
    if q:
        search = q.lower()
        roles = [
            r for r in roles
            if search in r.title.lower() or search in r.description.lower() or search in r.category.lower()
        ]
    return roles


@router.get("/{role_id}", response_model=JobRole)
async def get_job_role(role_id: str):
    """Get full specification, required/preferred skills, and suggested projects for a role."""
    for role in SEED_JOB_ROLES:
        if role.id == role_id:
            return role
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Job role with ID '{role_id}' not found.",
    )
