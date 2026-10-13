"""Resume Upload, PDF Parsing, and Skill Review API Router."""

import uuid
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel

from app.models.schemas import (
    ResumeAnalysisResponse,
    ExtractedSkill,
    SkillCategory,
    EvidenceType,
)
from app.services.pdf_parser import (
    extract_text_from_pdf,
    PDFParserError,
    ParsedPDFResult,
)
from app.services.skill_extractor import analyze_resume_document
from app.core.config import settings

router = APIRouter(prefix="/resumes", tags=["Resumes"])

# In-memory storage for development and session state
STORED_RESUMES: dict[str, dict] = {}
STORED_ANALYSES: dict[str, ResumeAnalysisResponse] = {}


class SkillUpdateRequest(BaseModel):
    skills: list[ExtractedSkill]


@router.post("", response_model=ResumeAnalysisResponse, status_code=status.HTTP_201_CREATED)
async def upload_and_analyze_resume(file: UploadFile = File(...)):
    """Upload PDF resume, validate structure, extract text, and extract skills with provenance."""
    # 1. Validate file extension
    filename = file.filename or "resume.pdf"
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF documents (.pdf) are supported.",
        )

    # 2. Read bytes with size protection
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}",
        )

    if len(content) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)}MB.",
        )

    # 3. Parse PDF
    try:
        parsed_pdf: ParsedPDFResult = extract_text_from_pdf(content)
    except PDFParserError as pe:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(pe),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during PDF parsing: {str(e)}",
        )

    resume_id = f"res_{uuid.uuid4().hex[:10]}"

    # 4. Perform Entity & Skill Extraction
    analysis = analyze_resume_document(parsed_pdf, resume_id=resume_id)

    # Persist in state
    STORED_RESUMES[resume_id] = {
        "resume_id": resume_id,
        "filename": filename,
        "size_bytes": len(content),
        "page_count": parsed_pdf.page_count,
        "char_count": parsed_pdf.total_characters,
        "raw_text": parsed_pdf.raw_text,
        "is_scanned": parsed_pdf.is_scanned,
        "ocr_message": parsed_pdf.ocr_message,
        "created_at": "2026-10-13T23:30:00Z",
    }
    STORED_ANALYSES[resume_id] = analysis

    return analysis


@router.get("", response_model=list[dict])
async def list_resumes():
    """List all user-uploaded resumes with metadata."""
    return [
        {
            "resume_id": r["resume_id"],
            "filename": r["filename"],
            "size_bytes": r["size_bytes"],
            "page_count": r["page_count"],
            "char_count": r["char_count"],
            "is_scanned": r["is_scanned"],
            "created_at": r["created_at"],
        }
        for r in STORED_RESUMES.values()
    ]


@router.get("/{resume_id}", response_model=dict)
async def get_resume(resume_id: str):
    """Retrieve raw parsed resume text and metadata."""
    if resume_id not in STORED_RESUMES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with ID '{resume_id}' not found.",
        )
    return STORED_RESUMES[resume_id]


@router.get("/{resume_id}/analysis", response_model=ResumeAnalysisResponse)
async def get_resume_analysis(resume_id: str):
    """Retrieve structured entity and skill analysis for resume."""
    if resume_id not in STORED_ANALYSES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis for resume ID '{resume_id}' not found.",
        )
    return STORED_ANALYSES[resume_id]


@router.patch("/{resume_id}/skills", response_model=ResumeAnalysisResponse)
async def update_extracted_skills(resume_id: str, payload: SkillUpdateRequest):
    """Allow user to edit, add, or confirm extracted skills and update analysis state."""
    if resume_id not in STORED_ANALYSES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis for resume ID '{resume_id}' not found.",
        )

    analysis = STORED_ANALYSES[resume_id]
    analysis.skills = payload.skills
    STORED_ANALYSES[resume_id] = analysis
    return analysis


@router.delete("/{resume_id}", status_code=status.HTTP_200_OK)
async def delete_resume(resume_id: str):
    """Securely delete uploaded resume, text extraction, and associated analyses."""
    if resume_id not in STORED_RESUMES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with ID '{resume_id}' not found.",
        )
    del STORED_RESUMES[resume_id]
    if resume_id in STORED_ANALYSES:
        del STORED_ANALYSES[resume_id]
    return {"deleted": True, "resume_id": resume_id}
