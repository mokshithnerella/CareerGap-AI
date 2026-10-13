"""Unit and Integration Tests for CareerGap AI Backend Services."""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.pdf_parser import validate_pdf_bytes, PDFParserError, extract_text_from_pdf
from app.services.taxonomy import normalize_skill_name, SEED_JOB_ROLES, SEED_LEARNING_RESOURCES
from app.services.matcher import compute_match_report
from app.services.roadmap_generator import generate_personalized_roadmap
from app.models.schemas import (
    JobSkillRequirement,
    ExtractedSkill,
    SkillCategory,
    EvidenceType,
    MatchStatus,
)


client = TestClient(app)


# 1. Test PDF Validation & Parsing
def test_pdf_validation_empty():
    with pytest.raises(PDFParserError, match="empty"):
        validate_pdf_bytes(b"")


def test_pdf_validation_invalid_signature():
    with pytest.raises(PDFParserError, match="magic header"):
        validate_pdf_bytes(b"NOT_A_PDF_FILE_HEADER_TEXT")


def test_pdf_validation_valid_header():
    # Valid header shouldn't raise
    validate_pdf_bytes(b"%PDF-1.4\n%some binary data\n")


# 2. Test Skill Normalization
def test_skill_normalization():
    assert normalize_skill_name("python3") == "Python"
    assert normalize_skill_name("js") == "JavaScript"
    assert normalize_skill_name("ts") == "TypeScript"
    assert normalize_skill_name("postgres") == "PostgreSQL"
    assert normalize_skill_name("k8s") == "Kubernetes"
    assert normalize_skill_name("reactjs") == "React"


# 3. Test Deterministic Scoring Engine
def test_scoring_perfect_match():
    reqs = [
        JobSkillRequirement(canonical_name="Python", weight=1.5, is_required=True),
        JobSkillRequirement(canonical_name="Docker", weight=1.0, is_required=True),
        JobSkillRequirement(canonical_name="PostgreSQL", weight=1.0, is_required=False),
    ]
    candidate = [
        ExtractedSkill(
            canonical_name="Python",
            category=SkillCategory.PROGRAMMING_LANGUAGE,
            evidence="Developed backend with Python",
            confidence=0.95,
            proficiency="advanced",
            user_confirmed=True,
        ),
        ExtractedSkill(
            canonical_name="Docker",
            category=SkillCategory.CLOUD_DEVOPS,
            evidence="Containerized service with Docker",
            confidence=0.95,
            proficiency="intermediate",
            user_confirmed=True,
        ),
        ExtractedSkill(
            canonical_name="PostgreSQL",
            category=SkillCategory.DATABASE,
            evidence="Managed schemas in PostgreSQL",
            confidence=0.95,
            proficiency="intermediate",
            user_confirmed=True,
        ),
    ]

    report = compute_match_report("Software Engineer", reqs, candidate)
    assert report.required_coverage == 100.0
    assert report.preferred_coverage == 100.0
    assert report.overall_score == 100.0
    assert report.matched_skills_count == 3
    assert report.missing_required_count == 0


def test_scoring_partial_and_missing():
    # 2 required: Python (weight 2.0, matched 1.0), PyTorch (weight 1.0, not detected 0.0)
    # Required coverage = 100 * (2.0*1.0 + 1.0*0.0) / (2.0 + 1.0) = 200 / 3 = 66.7%
    # 1 preferred: Docker (weight 1.0, partial 0.5)
    # Preferred coverage = 100 * (1.0*0.5) / 1.0 = 50.0%
    # Overall = 0.80 * 66.666 + 0.20 * 50 = 53.333 + 10 = 63.3%
    reqs = [
        JobSkillRequirement(canonical_name="Python", weight=2.0, is_required=True),
        JobSkillRequirement(canonical_name="PyTorch", weight=1.0, is_required=True),
        JobSkillRequirement(canonical_name="Docker", weight=1.0, is_required=False),
    ]
    candidate = [
        ExtractedSkill(
            canonical_name="Python",
            evidence="Built Python apps",
            confidence=0.95,
            user_confirmed=True,
        ),
        ExtractedSkill(
            canonical_name="Docker",
            evidence="Basic intro to Docker",
            confidence=0.70,  # Below 0.85 -> partial (0.5 value)
            user_confirmed=False,
        ),
    ]

    report = compute_match_report("AI Engineer", reqs, candidate)
    assert report.required_coverage == 66.7
    assert report.preferred_coverage == 50.0
    assert report.overall_score == 63.3
    assert report.matched_skills_count == 1
    assert report.partial_skills_count == 1
    assert report.missing_required_count == 1


def test_gap_prioritization_and_prerequisites():
    reqs = [
        JobSkillRequirement(canonical_name="TypeScript", weight=1.0, is_required=True),
        JobSkillRequirement(canonical_name="JavaScript", weight=1.0, is_required=True),
    ]
    candidate = []  # No skills

    report = compute_match_report("Frontend Developer", reqs, candidate)
    # JavaScript is a prerequisite of TypeScript
    # So JavaScript should have higher priority rank than TypeScript
    js_gap = next(g for g in report.skill_gaps if g.canonical_name == "JavaScript")
    ts_gap = next(g for g in report.skill_gaps if g.canonical_name == "TypeScript")
    assert js_gap.priority_rank < ts_gap.priority_rank


# 4. Test Roadmap Generation
def test_roadmap_generation():
    reqs = [
        JobSkillRequirement(canonical_name="PyTorch", weight=1.5, is_required=True),
        JobSkillRequirement(canonical_name="FastAPI", weight=1.2, is_required=True),
    ]
    report = compute_match_report("AI Engineer", reqs, [])
    roadmap = generate_personalized_roadmap(
        role_title="AI Engineer",
        candidate_skills=[],
        skill_gaps=report.skill_gaps,
        weekly_hours=10,
    )
    assert len(roadmap.phases) >= 3
    assert roadmap.total_tasks_count > 0
    assert roadmap.total_estimated_hours > 0
    assert roadmap.estimated_duration_weeks > 0


# 5. Test API Endpoints
def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"


def test_api_job_roles():
    res = client.get("/api/job-roles")
    assert res.status_code == 200
    roles = res.json()
    assert len(roles) >= 15
    role_titles = [r["title"] for r in roles]
    assert "AI Engineer" in role_titles
    assert "Full-Stack Developer" in role_titles


def test_api_resources():
    res = client.get("/api/resources?skill=Python")
    assert res.status_code == 200
    resources = res.json()
    assert len(resources) > 0
    assert any("Python" in r["title"] or "FastAPI" in r["title"] for r in resources)


def test_api_job_description_parse():
    payload = {
        "job_title": "Senior AI Systems Developer",
        "company_name": "Antigravity Corp",
        "raw_text": (
            "We are seeking an AI Engineer.\n"
            "Required skills:\n"
            "- Strong proficiency in Python and PyTorch\n"
            "- Experience building REST APIs with FastAPI\n"
            "Nice to have:\n"
            "- Familiarity with Docker and Kubernetes\n"
        )
    }
    res = client.post("/api/job-descriptions", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["job_title"] == "Senior AI Systems Developer"
    req_names = [s["canonical_name"] for s in data["required_skills"]]
    assert "Python" in req_names
    assert "PyTorch" in req_names
    assert "FastAPI" in req_names
    pref_names = [s["canonical_name"] for s in data["preferred_skills"]]
    assert "Docker" in pref_names or "Kubernetes" in pref_names


def test_synthetic_pdf_full_lifecycle():
    """End-to-end integration test: generate PDF, upload, parse, edit skills, match, and delete."""
    import pymupdf

    doc = pymupdf.open()
    page = doc.new_page()
    resume_content = (
        "Alex Chen - Candidate Profile\n"
        "alex.chen@university.edu\n\n"
        "TECHNICAL SKILLS:\n"
        "Languages: Python, TypeScript, SQL\n"
        "Frameworks & Tools: PyTorch, FastAPI, React, Docker\n\n"
        "WORK EXPERIENCE:\n"
        "Machine Learning Intern at AI Labs\n"
        "Developed deep learning models using Python and PyTorch for computer vision.\n\n"
        "PROJECTS:\n"
        "Autonomous Agent Framework\n"
        "Built asynchronous API microservices using FastAPI and containerized with Docker.\n\n"
        "EDUCATION:\n"
        "Bachelor of Science in Computer Science, University of Technology, 2024\n"
    )
    page.insert_text((50, 72), resume_content)
    pdf_bytes = doc.tobytes()

    # 1. Upload synthetic PDF
    upload_res = client.post(
        "/api/resumes",
        files={"file": ("alex_chen_resume.pdf", pdf_bytes, "application/pdf")},
    )
    assert upload_res.status_code == 201
    analysis_data = upload_res.json()
    resume_id = analysis_data["resume_id"]
    assert resume_id.startswith("res_")
    assert analysis_data["page_count"] == 1
    assert len(analysis_data["skills"]) >= 4

    extracted_names = [s["canonical_name"] for s in analysis_data["skills"]]
    assert "Python" in extracted_names
    assert "PyTorch" in extracted_names
    assert "FastAPI" in extracted_names
    assert "Docker" in extracted_names

    # 2. Get Analysis by ID
    get_res = client.get(f"/api/resumes/{resume_id}/analysis")
    assert get_res.status_code == 200

    # 3. User edits/confirms a skill
    current_skills = analysis_data["skills"]
    current_skills[0]["user_confirmed"] = True
    patch_res = client.patch(
        f"/api/resumes/{resume_id}/skills",
        json={"skills": current_skills},
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["skills"][0]["user_confirmed"] is True

    # 4. Generate match report using uploaded resume against AI Engineer role
    match_res = client.post(
        "/api/matches",
        json={"role_id": "role_ai_engineer", "resume_id": resume_id},
    )
    assert match_res.status_code == 201
    match_data = match_res.json()
    assert match_data["role_title"] == "AI Engineer"
    assert match_data["overall_score"] > 0
    assert len(match_data["items"]) > 0

    # 5. Generate roadmap from match
    roadmap_res = client.post(
        "/api/roadmaps/from-match",
        json={"match_id": match_data["match_id"], "weekly_hours": 12},
    )
    assert roadmap_res.status_code == 201
    roadmap_data = roadmap_res.json()
    assert roadmap_data["target_role"] == "AI Engineer"
    assert len(roadmap_data["phases"]) > 0

    # 6. Toggle a task
    first_phase = roadmap_data["phases"][0]
    first_task = first_phase["tasks"][0]
    toggle_res = client.patch(
        f"/api/roadmaps/{roadmap_data['id']}/tasks/{first_task['id']}",
        json={"is_completed": True},
    )
    assert toggle_res.status_code == 200
    assert toggle_res.json()["completed_tasks_count"] == 1

    # 7. Delete Resume
    del_res = client.delete(f"/api/resumes/{resume_id}")
    assert del_res.status_code == 200
    assert del_res.json()["deleted"] is True
