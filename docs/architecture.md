# CareerGap AI — System Architecture & Design Specification

## 1. Executive Overview

**CareerGap AI** is an AI-powered career intelligence platform engineered to bridge the divide between candidate credentials (PDF resumes) and real-world employer expectations (job roles and descriptions).

Unlike black-box AI tools that invent arbitrary match percentages or halluncinate qualifications, CareerGap AI employs a **hybrid dual-engine architecture**:
1. **AI Document & Entity Intelligence Layer**: Extracts raw text, preserves page provenance, extracts structured entities (skills, projects, work experience, education, certifications), and identifies canonical skill identifiers.
2. **Deterministic Match & Scoring Engine**: Applies mathematically reproducible, transparent formulas with 0–100 scoring based strictly on verified evidence and explicit user confirmations.

---

## 2. High-Level System Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                     |
|  Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS (Light / Dark Themes) |
+---------------------------------------------------------------------------------------+
         |                                                                      ^
         | 1. Upload PDF / Submit Job                                           | 7. Interactive
         |                                                                      |    Roadmap & Report
         v                                                                      |
+---------------------------------------------------------------------------------------+
|                           NEXT.JS ROUTE PROXY / REWRITES                              |
|                              (/api/[...path]/route.ts)                                |
+---------------------------------------------------------------------------------------+
         |
         | HTTP / JSON / Multipart
         v
+---------------------------------------------------------------------------------------+
|                               FASTAPI INTELLIGENCE API                                |
|                           (Python 3.15 + Uvicorn + Pydantic)                          |
+---------------------------------------------------------------------------------------+
   |                  |                    |                       |                  |
   v                  v                    v                       v                  v
[PDF Parser]    [LLM & Fallback]     [Taxonomy]              [Matcher]          [Roadmap Gen]
PyMuPDF /      Google Gemini /      15 Industry Roles       Deterministic      Personalized
PyPDF Fallback  NLP Provenance       80+ Canonical Skills   80/20 Weighted     Phases & Curated
& OCR check     Heuristics           Aliases & Prereqs      Formulas           Resources
         |
         +---------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                             PERSISTENCE & STORAGE TIER                                |
|   * SQLite (dev.db) / PostgreSQL via Prisma Client ORM                                |
|   * Local Private Encrypted PDF Storage / Isolated User Sessions                      |
|   * Normalized Models: UserProfile, Resume, MatchReport, SkillGap, Roadmap, Bookmark  |
+---------------------------------------------------------------------------------------+
```

---

## 3. Component Breakdown

### 3.1 Web Application (`apps/web`)
* **Framework**: Next.js 16 App Router with React 19, Server Components, and client state.
* **UI & Theming**: Tailwind CSS with unified color tokens and instantaneous Light/Dark theme switching (`ThemeToggle.tsx`).
* **Icons**: `lucide-react` for accessible, crisp UI symbols.
* **Forms & Validation**: Typed API clients (`lib/api.ts`) with strict TypeScript models for all request payloads and responses.
* **Session Management**: `AuthProvider` (`lib/auth.tsx`) supporting persistent user sessions and 1-Click Hackathon Demo mode.

### 3.2 Intelligence Service (`services/api`)
* **Framework**: FastAPI (asynchronous ASGI framework running on Uvicorn).
* **Document Extraction (`pdf_parser.py`)**: PyMuPDF (`fitz`) with automatic fallbacks to PyPDF. Performs magic byte inspection (`%PDF-`), page limits, memory limits, and scanned document detection.
* **Skill Extraction (`skill_extractor.py`)**: Configurable orchestration layer. Supports Google Gemini / OpenAI when credentials exist, with automatic fallback to high-precision NLP pattern matching with page-level sentence provenance.
* **Taxonomy Engine (`taxonomy.py`)**: 15 pre-seeded tech job roles, canonical skill taxonomy with aliases, prerequisites, and 40+ curated resources.
* **Matching Engine (`matcher.py`)**: Mathematical evaluation of required and preferred skills.
* **Roadmap Generator (`roadmap_generator.py`)**: Synthesizes identified skill gaps into 3-4 milestone learning phases with realistic duration estimates.

### 3.3 Database & Persistence Tier (`prisma/schema.prisma`)
* **ORM**: Prisma Client.
* **Supported Engines**: SQLite (`file:./dev.db`) for zero-config local development; PostgreSQL for production deployments.
* **Entities**:
  * `UserProfile`: User identity, career stage, weekly study budget, target timeline.
  * `Resume`: Document metadata, extracted page count, raw text.
  * `ResumeAnalysis`: Summary, provider used, link to skills.
  * `ExtractedSkill`: Canonical name, category, provenance sentence, confidence, proficiency, user confirmation.
  * `JobRole` & `JobSkillRequirement`: Seeded catalog of 15 industry roles with weights and prerequisites.
  * `MatchReport`: Overall score, required coverage, preferred coverage, item breakdowns.
  * `SkillGap`: Prioritized gaps with prerequisites and recommended learning effort.
  * `Roadmap`, `RoadmapPhase`, `RoadmapTask`: Milestone-based learning schedules with completion toggling.
  * `LearningResource`: Curated verified links, providers, duration, and price category.
