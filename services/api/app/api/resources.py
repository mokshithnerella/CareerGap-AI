"""Curated Learning Resources and Bookmarks API Router."""

import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.models.schemas import LearningResource
from app.services.taxonomy import SEED_LEARNING_RESOURCES

router = APIRouter(prefix="/resources", tags=["Learning Resources"])

STORED_BOOKMARKS: dict[str, dict] = {}


class BookmarkCreateRequest(BaseModel):
    resource_id: str
    notes: Optional[str] = ""


@router.get("", response_model=list[LearningResource])
async def list_resources(
    skill: Optional[str] = Query(None, description="Filter resources by skill tag"),
    difficulty: Optional[str] = Query(None, description="Beginner, Intermediate, Advanced"),
    price: Optional[str] = Query(None, description="Free, Paid, Freemium"),
):
    """List verified curated learning resources with optional filtering."""
    results = SEED_LEARNING_RESOURCES
    if skill:
        s_clean = skill.lower()
        results = [
            r for r in results
            if any(s_clean in t.lower() for t in r.skill_tags)
        ]
    if difficulty:
        results = [r for r in results if r.difficulty.lower() == difficulty.lower()]
    if price:
        results = [r for r in results if r.price_category.lower() == price.lower()]
    return results


@router.get("/{resource_id}", response_model=LearningResource)
async def get_resource(resource_id: str):
    """Retrieve details for a single verified learning resource."""
    for r in SEED_LEARNING_RESOURCES:
        if r.id == resource_id:
            return r
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Resource with ID '{resource_id}' not found.",
    )


@router.post("/bookmarks", status_code=status.HTTP_201_CREATED)
async def create_bookmark(payload: BookmarkCreateRequest):
    """Bookmark a learning resource for user's study list."""
    matched = next((r for r in SEED_LEARNING_RESOURCES if r.id == payload.resource_id), None)
    if not matched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource with ID '{payload.resource_id}' not found.",
        )
    b_id = f"bm_{uuid.uuid4().hex[:8]}"
    STORED_BOOKMARKS[b_id] = {
        "bookmark_id": b_id,
        "resource": matched.model_dump(),
        "notes": payload.notes,
        "created_at": "2026-10-13T23:30:00Z",
    }
    return STORED_BOOKMARKS[b_id]


@router.get("/bookmarks/all")
async def list_bookmarks():
    """List all saved bookmarks."""
    return list(STORED_BOOKMARKS.values())


@router.delete("/bookmarks/{bookmark_id}")
async def delete_bookmark(bookmark_id: str):
    """Remove a resource bookmark."""
    if bookmark_id not in STORED_BOOKMARKS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bookmark '{bookmark_id}' not found.",
        )
    del STORED_BOOKMARKS[bookmark_id]
    return {"deleted": True, "bookmark_id": bookmark_id}
