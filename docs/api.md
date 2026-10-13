# CareerGap AI — REST API Reference & Contracts

Base URL: `http://127.0.0.1:8000/api` (or proxied via Next.js at `/api/*`).

---

## 1. System Health

### `GET /api/health`
Diagnostics and runtime engine status.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "CareerGap AI Backend",
  "version": "1.0.0",
  "ai_provider": "deterministic_fallback",
  "max_upload_size_bytes": 10485760
}
```

---

## 2. Resumes & Document Processing

### `POST /api/resumes`
Uploads a binary PDF document, validates magic bytes, extracts text page-by-page, and extracts skills.

* **Content-Type**: `multipart/form-data`
* **Body**: `file: UploadFile` (.pdf, max 10MB)

**Response `201 Created`**:
```json
{
  "resume_id": "res_8df47cb9e1",
  "summary": "Demonstrated technical competencies in Python, PyTorch, FastAPI.",
  "page_count": 1,
  "char_count": 1420,
  "skills": [
    {
      "canonical_name": "Python",
      "category": "programming_language",
      "evidence": "Developed deep learning models using Python and PyTorch",
      "evidence_type": "work_experience",
      "confidence": 0.95,
      "proficiency": "intermediate",
      "source_page": 1,
      "user_confirmed": false
    }
  ],
  "projects": [],
  "experience": [],
  "education": [],
  "certifications": [],
  "raw_text_preview": "Alex Chen...",
  "provider_used": "Deterministic Taxonomy & Provenance Parser (Configured fallback)",
  "ocr_applied": false
}
```

### `GET /api/resumes`
Lists all uploaded resumes with size, page count, and timestamps.

### `GET /api/resumes/{resume_id}`
Returns raw extracted text and metadata for a specific resume.

### `GET /api/resumes/{resume_id}/analysis`
Returns structured analysis for a given resume.

### `PATCH /api/resumes/{resume_id}/skills`
Updates candidate skills following user verification or manual edits.

**Body**:
```json
{
  "skills": [ ... ]
}
```

### `DELETE /api/resumes/{resume_id}`
Securely purges the uploaded file and associated analyses from the server.

---

## 3. Job Roles & Job Descriptions

### `GET /api/job-roles`
Returns the 15 pre-seeded industry job roles with requirement weights and descriptions.
* **Query Parameters**:
  * `q` (optional): Filter by search keyword.
  * `category` (optional): Filter by domain category.

### `GET /api/job-roles/{role_id}`
Returns details for a single role.

### `POST /api/job-descriptions`
Parses custom job descriptions (pasted text) and extracts required and preferred skill criteria.

**Body**:
```json
{
  "job_title": "AI Platform Engineer",
  "company_name": "Acme AI Corp",
  "raw_text": "We require Python, PyTorch, and Docker experience..."
}
```

---

## 4. Deterministic Matching & Scoring

### `POST /api/matches`
Computes transparent, reproducible alignment scores between candidate skills and job requirements.

**Body**:
```json
{
  "role_id": "role_ai_engineer",
  "resume_id": "res_8df47cb9e1"
}
```
*(or provide `custom_role_title` and `custom_requirements`)*

**Response `201 Created`**:
```json
{
  "match_id": "match_1a2b3c4d",
  "role_title": "AI Engineer",
  "overall_score": 78.5,
  "required_coverage": 82.0,
  "preferred_coverage": 65.0,
  "required_weight_sum": 6.7,
  "preferred_weight_sum": 2.5,
  "matched_skills_count": 4,
  "partial_skills_count": 1,
  "missing_required_count": 1,
  "missing_preferred_count": 1,
  "items": [
    {
      "canonical_name": "Python",
      "category": "programming_language",
      "is_required": true,
      "weight": 1.5,
      "match_status": "matched",
      "match_value": 1.0,
      "evidence": "Developed deep learning models using Python and PyTorch",
      "confidence": 0.95,
      "explanation": "Explicit evidence identified on Page 1 with intermediate proficiency.",
      "source_page": 1,
      "user_confirmed": false
    }
  ],
  "skill_gaps": [
    {
      "canonical_name": "Large Language Models (LLMs)",
      "category": "ai_ml",
      "is_required": true,
      "importance_weight": 1.5,
      "why_it_matters": "Critical competency for generative workflows, prompt engineering, and RAG pipelines.",
      "current_evidence": null,
      "recommended_target": "intermediate",
      "suggested_action": "Complete a hands-on project deploying a RAG assistant with vector embeddings.",
      "estimated_effort_hours": 25,
      "prerequisites": ["Python", "Machine Learning"],
      "priority_rank": 1
    }
  ]
}
```

---

## 5. Personalized Learning Roadmaps

### `POST /api/roadmaps/from-match`
Synthesizes identified skill gaps into sequential milestone learning phases based on the candidate's weekly study budget.

**Body**:
```json
{
  "match_id": "match_1a2b3c4d",
  "weekly_hours": 12,
  "target_timeline_weeks": 10,
  "learning_preference": "hands_on_projects"
}
```

### `PATCH /api/roadmaps/{roadmap_id}/tasks/{task_id}`
Toggles milestone task completion status.

**Body**:
```json
{
  "is_completed": true
}
```

---

## 6. Curated Learning Resources

### `GET /api/resources`
Filters verified curated learning resources.
* **Query Parameters**:
  * `skill`: Filter by canonical skill tag (e.g., `Python`, `PyTorch`).
  * `difficulty`: `beginner`, `intermediate`, `advanced`.
  * `price`: `free`, `freemium`, `paid`.
