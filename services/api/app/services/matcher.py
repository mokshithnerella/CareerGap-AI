"""Deterministic Job-Matching and Skill-Gap Prioritization Engine.

Implements transparent, reproducible scoring formulas without arbitrary LLM percentages:
  Required Coverage = 100 * SUM(weight * match_value) / SUM(weight)
  Preferred Coverage = 100 * SUM(weight * match_value) / SUM(weight)
  Overall Score = 0.80 * Required Coverage + 0.20 * Preferred Coverage
"""

import uuid
from typing import Optional
from app.models.schemas import (
    ExtractedSkill,
    JobSkillRequirement,
    JobRole,
    MatchStatus,
    MatchItem,
    SkillGap,
    MatchReport,
    SkillCategory,
)
from app.services.taxonomy import SKILL_TAXONOMY, normalize_skill_name


def evaluate_skill_match(
    req: JobSkillRequirement,
    candidate_skills_by_name: dict[str, ExtractedSkill],
) -> MatchItem:
    """Evaluate candidate evidence against a specific job requirement."""
    canonical = normalize_skill_name(req.canonical_name)
    skill_info = SKILL_TAXONOMY.get(canonical, {})
    category = req.category if req.category != SkillCategory.OTHER else skill_info.get("category", SkillCategory.OTHER)

    # Check candidate evidence
    if canonical in candidate_skills_by_name:
        candidate_skill = candidate_skills_by_name[canonical]
        # Full match if user confirmed or supported by project/experience
        if candidate_skill.user_confirmed or candidate_skill.confidence >= 0.85:
            return MatchItem(
                canonical_name=canonical,
                category=category,
                is_required=req.is_required,
                weight=req.weight,
                match_status=MatchStatus.MATCHED,
                match_value=1.0,
                evidence=candidate_skill.evidence,
                confidence=candidate_skill.confidence,
                explanation=f"Explicit evidence identified on Page {candidate_skill.source_page} with {candidate_skill.proficiency} proficiency.",
                source_page=candidate_skill.source_page,
                user_confirmed=candidate_skill.user_confirmed,
            )
        else:
            return MatchItem(
                canonical_name=canonical,
                category=category,
                is_required=req.is_required,
                weight=req.weight,
                match_status=MatchStatus.PARTIAL,
                match_value=0.5,
                evidence=candidate_skill.evidence,
                confidence=candidate_skill.confidence,
                explanation="Partial or introductory evidence detected. Further verification recommended.",
                source_page=candidate_skill.source_page,
                user_confirmed=False,
            )

    # Not detected
    return MatchItem(
        canonical_name=canonical,
        category=category,
        is_required=req.is_required,
        weight=req.weight,
        match_status=MatchStatus.NOT_DETECTED,
        match_value=0.0,
        evidence=None,
        confidence=0.0,
        explanation="Not detected in uploaded document. This indicates absence of written evidence, not necessarily lack of skill.",
        source_page=None,
        user_confirmed=False,
    )


def compute_match_report(
    role_title: str,
    requirements: list[JobSkillRequirement],
    candidate_skills: list[ExtractedSkill],
    match_id: Optional[str] = None,
) -> MatchReport:
    """Compute transparent reproducible match report and prioritize gaps."""
    # Index candidate skills by canonical lowercase
    candidate_map = {
        normalize_skill_name(s.canonical_name): s
        for s in candidate_skills
    }

    match_items: list[MatchItem] = []
    req_weights: list[float] = []
    req_values: list[float] = []
    pref_weights: list[float] = []
    pref_values: list[float] = []

    matched_count = 0
    partial_count = 0
    missing_req_count = 0
    missing_pref_count = 0

    for req in requirements:
        item = evaluate_skill_match(req, candidate_map)
        match_items.append(item)

        if item.is_required:
            req_weights.append(item.weight)
            req_values.append(item.weight * item.match_value)
            if item.match_status == MatchStatus.MATCHED:
                matched_count += 1
            elif item.match_status == MatchStatus.PARTIAL:
                partial_count += 1
            else:
                missing_req_count += 1
        else:
            pref_weights.append(item.weight)
            pref_values.append(item.weight * item.match_value)
            if item.match_status == MatchStatus.MATCHED:
                matched_count += 1
            elif item.match_status == MatchStatus.PARTIAL:
                partial_count += 1
            else:
                missing_pref_count += 1

    # Safe mathematical division
    sum_req_w = sum(req_weights)
    sum_req_v = sum(req_values)
    sum_pref_w = sum(pref_weights)
    sum_pref_v = sum(pref_values)

    required_coverage = (100.0 * sum_req_v / sum_req_w) if sum_req_w > 0 else 0.0
    preferred_coverage = (100.0 * sum_pref_v / sum_pref_w) if sum_pref_w > 0 else 0.0

    if sum_req_w > 0 and sum_pref_w > 0:
        overall_score = (0.80 * required_coverage) + (0.20 * preferred_coverage)
    elif sum_req_w > 0:
        overall_score = required_coverage
    elif sum_pref_w > 0:
        overall_score = preferred_coverage
    else:
        overall_score = 0.0

    overall_score = max(0.0, min(100.0, round(overall_score, 1)))
    required_coverage = max(0.0, min(100.0, round(required_coverage, 1)))
    preferred_coverage = max(0.0, min(100.0, round(preferred_coverage, 1)))

    # Compute & Prioritize Skill Gaps
    skill_gaps: list[SkillGap] = []
    for item in match_items:
        if item.match_status in [MatchStatus.NOT_DETECTED, MatchStatus.PARTIAL]:
            tax_entry = SKILL_TAXONOMY.get(item.canonical_name, {})
            prereqs = tax_entry.get("prerequisites", [])

            why_matters = (
                f"Essential core competency for {role_title}. "
                f"Required to execute technical deliverables and system requirements."
                if item.is_required
                else f"Valued competitive edge for {role_title} giving strong technical depth."
            )

            action = (
                f"Complete hands-on projects and study official documentation for {item.canonical_name}."
                if item.match_status == MatchStatus.NOT_DETECTED
                else f"Deepen practical application of {item.canonical_name} with advanced architecture and unit tests."
            )

            # Effort estimate: 25h for full gap, 12h for partial
            effort = 25 if item.match_status == MatchStatus.NOT_DETECTED else 12

            skill_gaps.append(SkillGap(
                canonical_name=item.canonical_name,
                category=item.category,
                is_required=item.is_required,
                importance_weight=item.weight,
                why_it_matters=why_matters,
                current_evidence=item.evidence,
                recommended_target="intermediate",
                suggested_action=action,
                estimated_effort_hours=effort,
                prerequisites=prereqs,
                priority_rank=1,
            ))

    # Sort gaps by prerequisite topological priority, requirement status, and weight
    # Skills that are prerequisites of other gaps must come earlier
    all_gap_names = {g.canonical_name for g in skill_gaps}
    is_prereq_map = {
        g.canonical_name: any(g.canonical_name in other.prerequisites for other in skill_gaps)
        for g in skill_gaps
    }

    def gap_sort_key(gap: SkillGap) -> tuple:
        # Prioritize: 1. Is it a prerequisite of another gap?
        # 2. Is it required? (True first -> 0)
        # 3. Higher weight first (negative weight)
        is_needed_by_others = 0 if is_prereq_map.get(gap.canonical_name, False) else 1
        req_order = 0 if gap.is_required else 1
        return (is_needed_by_others, req_order, -gap.importance_weight)

    sorted_gaps = sorted(skill_gaps, key=gap_sort_key)
    for idx, gap in enumerate(sorted_gaps):
        gap.priority_rank = idx + 1

    return MatchReport(
        match_id=match_id or f"match_{uuid.uuid4().hex[:10]}",
        role_title=role_title,
        overall_score=overall_score,
        required_coverage=required_coverage,
        preferred_coverage=preferred_coverage,
        required_weight_sum=round(sum_req_w, 2),
        preferred_weight_sum=round(sum_pref_w, 2),
        items=match_items,
        matched_skills_count=matched_count,
        partial_skills_count=partial_count,
        missing_required_count=missing_req_count,
        missing_preferred_count=missing_pref_count,
        skill_gaps=sorted_gaps,
    )
