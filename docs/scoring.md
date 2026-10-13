# CareerGap AI — Scoring Methodology & Evaluation Framework

## 1. Core Philosophy: Deterministic & Explainable

Traditional AI resume screeners use opaque generative prompts (e.g. asking a chatbot *"Rate this resume from 1 to 100"*). This produces hallucinations, non-reproducible scores, and demographic bias.

CareerGap AI decouples **entity extraction** from **score computation**:
1. AI & NLP algorithms identify written skills and preserve supporting sentence provenance.
2. A deterministic mathematical engine calculates reproducible alignment percentages.
3. Every score point is attributable to specific required or preferred requirements.

---

## 2. Mathematical Scoring Formulas

### 2.1 Match Values per Requirement
For each job requirement $r_i$ with importance weight $w_i$:

| Match Status | Match Value ($v_i$) | Qualification Criteria |
| :--- | :--- | :--- |
| **Matched** | `1.0` | Explicit written evidence with confidence $\ge 0.85$, or verified by user confirmation. |
| **Partial** | `0.5` | Introductory evidence or partial match (confidence $< 0.85$). |
| **Not Detected** | `0.0` | No evidence found in document (treated as *absence of evidence*, not proof of incompetence). |

### 2.2 Required-Skill Coverage
Measures how thoroughly the candidate satisfies non-negotiable core competencies:

$$\text{Required Coverage} = 100 \times \frac{\sum_{i \in \text{Req}} (w_i \times v_i)}{\sum_{i \in \text{Req}} w_i}$$

If no required skills exist, coverage defaults safely to $0.0\%$.

### 2.3 Preferred-Skill Coverage
Measures competitive differentiation across "nice-to-have" secondary competencies:

$$\text{Preferred Coverage} = 100 \times \frac{\sum_{j \in \text{Pref}} (w_j \times v_j)}{\sum_{j \in \text{Pref}} w_j}$$

### 2.4 Overall Match Alignment Score
When both required and preferred requirements exist, CareerGap AI applies an **80 / 20 weighting ratio**:

$$\text{Overall Score} = (0.80 \times \text{Required Coverage}) + (0.20 \times \text{Preferred Coverage})$$

* Edge Cases:
  * If the role has only required requirements: $\text{Overall Score} = \text{Required Coverage}$.
  * If the role has only preferred requirements: $\text{Overall Score} = \text{Preferred Coverage}$.
  * Normalized strictly to the range `0.0` to `100.0`.

---

## 3. Worked Example Calculation

### Target Role: AI Engineer
* **Required Requirements**:
  1. Python (weight: 1.5) $\rightarrow$ Matched ($v = 1.0$) $\rightarrow$ Contribution = $1.5 \times 1.0 = 1.5$
  2. PyTorch (weight: 1.4) $\rightarrow$ Matched ($v = 1.0$) $\rightarrow$ Contribution = $1.4 \times 1.0 = 1.4$
  3. Machine Learning (weight: 1.3) $\rightarrow$ Partial ($v = 0.5$) $\rightarrow$ Contribution = $1.3 \times 0.5 = 0.65$
  4. LLMs (weight: 1.5) $\rightarrow$ Not Detected ($v = 0.0$) $\rightarrow$ Contribution = $1.5 \times 0.0 = 0.0$
  5. FastAPI (weight: 1.0) $\rightarrow$ Matched ($v = 1.0$) $\rightarrow$ Contribution = $1.0 \times 1.0 = 1.0$
  * **Sum of Weights**: $1.5 + 1.4 + 1.3 + 1.5 + 1.0 = 6.7$
  * **Sum of Values**: $1.5 + 1.4 + 0.65 + 0.0 + 1.0 = 4.55$
  * **Required Coverage**: $100 \times \frac{4.55}{6.7} = 67.9\%$

* **Preferred Requirements**:
  1. Docker (weight: 1.0) $\rightarrow$ Matched ($v = 1.0$) $\rightarrow$ Contribution = $1.0$
  2. PostgreSQL (weight: 0.8) $\rightarrow$ Not Detected ($v = 0.0$) $\rightarrow$ Contribution = $0.0$
  * **Sum of Weights**: $1.0 + 0.8 = 1.8$
  * **Sum of Values**: $1.0$
  * **Preferred Coverage**: $100 \times \frac{1.0}{1.8} = 55.6\%$

* **Overall Score**:
  $$\text{Overall Score} = (0.80 \times 67.9) + (0.20 \times 55.6) = 54.32 + 11.12 = 65.4\%$$

---

## 4. Skill-Gap Prioritization Engine

Skill gaps are prioritized for roadmap generation according to:
1. **Prerequisite Ordering**: Foundational skills (e.g. JavaScript before TypeScript; Python before PyTorch) are scheduled first.
2. **Requirement Status**: Required skills rank strictly ahead of preferred skills.
3. **Importance Weight**: Higher-weighted skills within the same tier take precedence.
