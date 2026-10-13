<<<<<<< HEAD
# CareerGap AI — AI-Powered Career Intelligence & Skill Gap Analyzer

[![Tests](https://img.shields.io/badge/tests-26%20passed-brightgreen.svg)](scripts/run-tests.ps1)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748.svg)](https://www.prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **CareerGap AI** is an AI-powered career intelligence web application that securely analyzes PDF resumes, benchmarks candidate credentials against real-world engineering job requirements, calculates transparent and reproducible 0–100 match alignment scores, and generates personalized milestone-driven learning roadmaps.

---

## 1. Key Features

- **Genuine PDF Document Processing**: Page-by-page text extraction with PyMuPDF (`fitz`) and PyPDF fallback, PDF magic byte verification (`%PDF-`), page limits, and corrupted/encrypted document handling.
- **Explainable Skill & Entity Extraction**: Identifies technical skills, tools, frameworks, projects, work experience, and education with sentence-level page provenance. Supports Google Gemini / OpenAI with an autonomous deterministic fallback.
- **15 Pre-Seeded Industry Tech Job Roles**: Software Engineer, Frontend Developer, Backend Developer, Full-Stack Developer, Python Developer, Data Analyst, Data Scientist, Machine Learning Engineer, AI Engineer, Data Engineer, DevOps Engineer, Cloud Engineer, Cybersecurity Analyst, QA Automation Engineer, and Mobile App Developer.
- **Custom Job Description Parser**: Paste or upload employer job descriptions to automatically extract required vs. preferred competencies.
- **Deterministic 0–100 Matching Engine**: Mathematically reproducible scoring ($80\%$ required-skill coverage $+ 20\%$ preferred-skill coverage). Zero hallucinations or fabricated numbers.
- **Personalized Learning Roadmaps**: Automatically converts identified skill gaps into 3–4 milestone learning phases tailored to the user's weekly study budget (e.g. 10–12 hrs/week).
- **Curated Learning Resources**: 40+ verified educational links (official documentation, reputable interactive labs, tutorials) mapped directly to canonical skills.
- **Design System & Aesthetics**: Dark and light themes with instant client toggle, glassmorphic panels, accessible typography, responsive mobile drawers, and charts.
- **Complete Client Privacy Controls**: Zero data retention for model training, instant 1-click JSON data export, and full user data purge.

---

## 2. Architecture Overview

```
+-------------------------------------------------------------+
|                        Next.js Web                          |
|  React 19, TypeScript, Tailwind CSS, Lucide, Recharts       |
+-------------------------------------------------------------+
                              |
                     /api/[...path] proxy
                              |
                              v
+-------------------------------------------------------------+
|                      FastAPI Backend                        |
|  PyMuPDF, Pydantic, Matcher Engine, Taxonomy & Roadmap Gen  |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                  Persistence & Database                     |
|  Prisma Client ORM (SQLite for dev, PostgreSQL for prod)    |
+-------------------------------------------------------------+
```

Detailed technical documentation:
* [Architecture Specification](docs/architecture.md)
* [REST API Reference](docs/api.md)
* [Scoring Methodology & Formulas](docs/scoring.md)
* [Security & Privacy Guide](docs/security.md)

---

## 3. Quickstart & Local Setup

### Prerequisites
* **Node.js**: v20+ (tested on Node v24.14.1)
* **Python**: 3.10+ (tested on Python 3.15)
* **npm**: v10+

### Step 1: Clone and Configure Environment
```bash
git clone https://github.com/your-username/careergap-ai.git
cd careergap-ai
cp .env.example .env
```

### Step 2: Install Backend Dependencies & Start FastAPI
```bash
cd services/api
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*API interactive documentation will be live at `http://127.0.0.1:8000/docs`.*

### Step 3: Install Frontend Dependencies & Initialize Database
In a new terminal window:
```bash
cd apps/web
npm install
npx prisma db push
node --experimental-strip-types prisma/seed.ts
npm run dev
```
*Web application will be live at `http://localhost:3000`.*

---

## 4. Running with Docker Compose

To launch the complete stack (Next.js web, FastAPI backend, PostgreSQL database) with a single command:
```bash
docker compose up --build
```
* Access the web UI at `http://localhost:3000`
* Access API OpenAPI docs at `http://localhost:8000/docs`

---

## 5. Verification & Automated Tests

CareerGap AI includes 26 automated unit and end-to-end integration tests:

### Run Python Backend Tests (13 tests)
```bash
cd services/api
python -m pytest tests/ -v
```
*Validates PDF magic byte parsing, in-memory synthetic PDF uploads, skill normalization, 80/20 scoring, gap prioritization, roadmap phase synthesis, and REST endpoints.*

### Run TypeScript Frontend Tests (13 tests)
```bash
cd apps/web
npx vitest run
```
*Validates deterministic scoring math, zero-requirement safeguards, study duration calculations, prerequisite dependency sorting, and the full candidate user journey.*

### Run All Tests via Automation Script
* **Windows PowerShell**:
  ```powershell
  .\scripts\run-tests.ps1
  ```
* **Linux/macOS Bash**:
  ```bash
  ./scripts/run-tests.sh
  ```

---

## 6. Hackathon 2-Minute Demonstration Script

For judges and presentations, follow this flow:

1. **Visit Landing Page (`http://localhost:3000`)**:
   - Showcase the modern visual design, dark/light theme toggle, and live statistics.
2. **Access 1-Click Demo Mode (`/auth` or click "Live Demo Mode")**:
   - Pre-loaded with synthetic candidate profile *Alex Chen (Senior Undergraduate / Aspiring AI Engineer)*.
3. **Upload or Inspect Resume (`/resume`)**:
   - Drag & drop a real PDF or click *"Load Synthetic AI Engineer Resume"*.
   - Point out extracted technical skills with sentence provenance and page numbers (e.g., Page 1: *"Developed deep learning models using Python and PyTorch"*).
   - Edit or confirm a skill and observe immediate persistence.
4. **Target a Job Role (`/target-job`)**:
   - Select **AI Engineer** from the 15-role catalog, or paste a custom job description.
5. **Inspect Deterministic Alignment Score (`/analysis`)**:
   - Open the **Scoring Methodology Breakdown**. Explain that the score (e.g. 78.5%) is calculated via `0.80 * Required Coverage + 0.20 * Preferred Coverage` without arbitrary LLM guessing.
6. **Execute Personalized Learning Roadmap (`/roadmap`)**:
   - Review milestone phases (Foundations $\rightarrow$ Core Gaps $\rightarrow$ Capstones $\rightarrow$ Portfolio).
   - Check off a completed task and observe progress updating in real time.
7. **Verify Dashboard & History (`/dashboard` & `/history`)**:
   - Confirm that all match reports and progress persist across refreshes.

---

## 7. License

Released under the MIT License. Built for students, engineers, and career switchers.
=======
# CareerGap-AI
Project
>>>>>>> a8719dbda255dd6a9140275cdcd8169c50038ff4
