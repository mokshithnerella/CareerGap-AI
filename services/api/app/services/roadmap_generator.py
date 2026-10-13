"""Personalized Roadmap Generation Service.

Synthesizes candidate skill gaps into sequential milestone phases:
1. Foundations & Prerequisites
2. Core Technical Competencies
3. Applied Engineering & Projects
4. Portfolio, Architecture & Interview Readiness
"""

import uuid
import math
from app.models.schemas import (
    Roadmap,
    RoadmapPhase,
    RoadmapTask,
    SkillGap,
    LearningResource,
)
from app.services.taxonomy import SEED_LEARNING_RESOURCES, SKILL_TAXONOMY


def find_resources_for_skill(skill_name: str) -> list[LearningResource]:
    """Retrieve curated verified resources matching a given skill name."""
    matched = []
    clean_target = skill_name.lower()
    for res in SEED_LEARNING_RESOURCES:
        if any(tag.lower() == clean_target or tag.lower() in clean_target for tag in res.skill_tags):
            matched.append(res)
    return matched[:3]


def generate_personalized_roadmap(
    role_title: str,
    candidate_skills: list[str],
    skill_gaps: list[SkillGap],
    weekly_hours: int = 10,
    target_timeline_weeks: int = 12,
    learning_preference: str = "hands_on_projects",
    roadmap_id: str | None = None,
) -> Roadmap:
    """Generate structured, realistic learning roadmap based on prioritized skill gaps."""
    r_id = roadmap_id or f"rdm_{uuid.uuid4().hex[:10]}"
    weekly_hours = max(2, min(40, weekly_hours))

    if not skill_gaps:
        # Candidate already matches all requirements
        tasks = [
            RoadmapTask(
                id=f"task_{uuid.uuid4().hex[:8]}",
                phase_id="p1",
                title=f"Advanced {role_title} System Architecture & Scalability",
                description="Study production high-availability and distributed systems patterns.",
                target_skill="System Design",
                deliverable="Architectural whitepaper with benchmark metrics.",
                estimated_hours=15,
                is_completed=False,
                resources=find_resources_for_skill("System Design"),
            ),
            RoadmapTask(
                id=f"task_{uuid.uuid4().hex[:8]}",
                phase_id="p1",
                title=f"End-to-End Capstone Portfolio Project for {role_title}",
                description="Build and deploy a real-world production application.",
                target_skill="Full-Stack Developer",
                deliverable="Public GitHub repository with CI/CD pipeline and live demo link.",
                estimated_hours=25,
                is_completed=False,
                resources=find_resources_for_skill("Python"),
            ),
        ]
        phase1 = RoadmapPhase(
            id="p1",
            phase_number=1,
            title="Advanced Mastery & Capstone",
            description="You already meet the baseline criteria. Focus on capstone depth and competitive edge.",
            estimated_weeks=4,
            tasks=tasks,
        )
        return Roadmap(
            id=r_id,
            title=f"Personalized Career Acceleration: {role_title}",
            target_role=role_title,
            estimated_duration_weeks=4,
            weekly_hours=weekly_hours,
            total_estimated_hours=40,
            phases=[phase1],
            completed_tasks_count=0,
            total_tasks_count=len(tasks),
        )

    # Partition gaps into Phase 1 (Foundations/Prerequisites), Phase 2 (Core Required Skills),
    # Phase 3 (Applied Practical Projects), Phase 4 (Portfolio & Interview Readiness)
    prereq_gaps: list[SkillGap] = []
    core_gaps: list[SkillGap] = []
    secondary_gaps: list[SkillGap] = []

    # Identify which skills serve as prerequisites for other gaps
    all_gap_names = {g.canonical_name for g in skill_gaps}
    for gap in skill_gaps:
        is_needed_by_others = any(gap.canonical_name in other.prerequisites for other in skill_gaps)
        if is_needed_by_others or not gap.prerequisites:
            prereq_gaps.append(gap)
        elif gap.is_required:
            core_gaps.append(gap)
        else:
            secondary_gaps.append(gap)

    phases: list[RoadmapPhase] = []
    total_hours = 0
    total_tasks = 0

    # Phase 1: Foundations & Prerequisites
    p1_tasks: list[RoadmapTask] = []
    p1_id = f"phase_1_{r_id[:6]}"
    p1_targets = prereq_gaps if prereq_gaps else skill_gaps[:2]
    for gap in p1_targets[:3]:
        res = find_resources_for_skill(gap.canonical_name)
        hours = max(8, gap.estimated_effort_hours // 2)
        task = RoadmapTask(
            id=f"tsk_{uuid.uuid4().hex[:8]}",
            phase_id=p1_id,
            title=f"Master {gap.canonical_name} Fundamentals & Syntax",
            description=f"Gain conceptual clarity and review documentation for {gap.canonical_name}. {gap.suggested_action}",
            target_skill=gap.canonical_name,
            deliverable=f"Completed {gap.canonical_name} exercises and basic operational scripts.",
            estimated_hours=hours,
            is_completed=False,
            resources=res,
        )
        p1_tasks.append(task)
        total_hours += hours

    p1_weeks = max(1, math.ceil(sum(t.estimated_hours for t in p1_tasks) / weekly_hours))
    phases.append(RoadmapPhase(
        id=p1_id,
        phase_number=1,
        title="Foundations & Skill Prerequisites",
        description="Establish fundamental concepts and prerequisite competencies required for advanced workflows.",
        estimated_weeks=p1_weeks,
        tasks=p1_tasks,
    ))

    # Phase 2: Core Technical Competencies
    p2_tasks: list[RoadmapTask] = []
    p2_id = f"phase_2_{r_id[:6]}"
    p2_targets = core_gaps if core_gaps else [g for g in skill_gaps if g not in p1_targets][:3]
    if not p2_targets:
        p2_targets = skill_gaps[:2]

    for gap in p2_targets[:3]:
        res = find_resources_for_skill(gap.canonical_name)
        hours = gap.estimated_effort_hours
        task = RoadmapTask(
            id=f"tsk_{uuid.uuid4().hex[:8]}",
            phase_id=p2_id,
            title=f"Implement Production {gap.canonical_name} Workflows",
            description=f"Deep-dive into {gap.canonical_name}. Build intermediate components and review edge cases.",
            target_skill=gap.canonical_name,
            deliverable=f"Fully tested, modular {gap.canonical_name} module with documentation.",
            estimated_hours=hours,
            is_completed=False,
            resources=res,
        )
        p2_tasks.append(task)
        total_hours += hours

    p2_weeks = max(1, math.ceil(sum(t.estimated_hours for t in p2_tasks) / weekly_hours))
    phases.append(RoadmapPhase(
        id=p2_id,
        phase_number=2,
        title="Core Technical Competencies",
        description="Deep-dive into mandatory job requirements and implement real-world functional code.",
        estimated_weeks=p2_weeks,
        tasks=p2_tasks,
    ))

    # Phase 3: Applied Projects & Integration
    p3_tasks: list[RoadmapTask] = []
    p3_id = f"phase_3_{r_id[:6]}"
    top_gap_names = [g.canonical_name for g in skill_gaps[:3]]
    proj_hours = max(15, weekly_hours * 2)
    p3_task = RoadmapTask(
        id=f"tsk_{uuid.uuid4().hex[:8]}",
        phase_id=p3_id,
        title=f"Build End-to-End {role_title} Showcase Application",
        description=f"Integrate {', '.join(top_gap_names)} into a unified application matching actual workplace challenges.",
        target_skill=top_gap_names[0] if top_gap_names else role_title,
        deliverable="Deployed application repository with automated unit tests and architectural documentation.",
        estimated_hours=proj_hours,
        is_completed=False,
        resources=find_resources_for_skill(top_gap_names[0]) if top_gap_names else [],
    )
    p3_tasks.append(p3_task)
    total_hours += proj_hours
    p3_weeks = max(1, math.ceil(proj_hours / weekly_hours))

    phases.append(RoadmapPhase(
        id=p3_id,
        phase_number=3,
        title="Applied Engineering & Real-World Projects",
        description="Synthesize acquired skills by architecting and deploying a comprehensive capstone application.",
        estimated_weeks=p3_weeks,
        tasks=p3_tasks,
    ))

    # Phase 4: Portfolio, System Design & Interview Preparation
    p4_tasks: list[RoadmapTask] = []
    p4_id = f"phase_4_{r_id[:6]}"
    interview_hours = max(10, weekly_hours)
    p4_task = RoadmapTask(
        id=f"tsk_{uuid.uuid4().hex[:8]}",
        phase_id=p4_id,
        title=f"Technical Interview Readiness & Defense for {role_title}",
        description="Practice technical design explanations, system trade-offs, and behavioral resume alignment.",
        target_skill="System Design",
        deliverable="Refined portfolio presentation and mock technical interview debrief.",
        estimated_hours=interview_hours,
        is_completed=False,
        resources=find_resources_for_skill("System Design"),
    )
    p4_tasks.append(p4_task)
    total_hours += interview_hours
    p4_weeks = max(1, math.ceil(interview_hours / weekly_hours))

    phases.append(RoadmapPhase(
        id=p4_id,
        phase_number=4,
        title="Portfolio & Interview Readiness",
        description="Polish deliverables, verify deployment integrity, and prepare technical interview demonstrations.",
        estimated_weeks=p4_weeks,
        tasks=p4_tasks,
    ))

    total_duration_weeks = sum(p.estimated_weeks for p in phases)
    for p in phases:
        total_tasks += len(p.tasks)

    return Roadmap(
        id=r_id,
        title=f"Targeted Skill Roadmap: {role_title}",
        target_role=role_title,
        estimated_duration_weeks=total_duration_weeks,
        weekly_hours=weekly_hours,
        total_estimated_hours=total_hours,
        phases=phases,
        completed_tasks_count=0,
        total_tasks_count=total_tasks,
    )
