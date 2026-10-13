import { describe, it, expect, beforeEach } from "vitest";
import { computeScore } from "./scoring.test";

describe("CareerGap AI Complete User Journey Simulation", () => {
  // Synthetic candidate storage mocking client lifecycle
  let candidateStorage: Record<string, string> = {};

  beforeEach(() => {
    candidateStorage = {};
  });

  it("completes full candidate lifecycle from profile setup to roadmap task completion", () => {
    // Step 1: User Onboarding / Profile setup
    const userProfile = {
      id: "usr_alex_chen",
      fullName: "Alex Chen",
      email: "alex.chen@university.edu",
      careerStage: "Senior Undergraduate / Aspiring AI Engineer",
      weeklyHours: 12,
      targetTimelineWeeks: 10,
      learningPreference: "hands_on_projects",
    };
    candidateStorage["careergap_user_session"] = JSON.stringify(userProfile);
    expect(JSON.parse(candidateStorage["careergap_user_session"]).fullName).toBe("Alex Chen");

    // Step 2: Resume extraction simulation
    const extractedSkills = [
      { canonical_name: "Python", is_required: true, weight: 1.5, match_value: 1.0, user_confirmed: true },
      { canonical_name: "PyTorch", is_required: true, weight: 1.4, match_value: 1.0, user_confirmed: true },
      { canonical_name: "FastAPI", is_required: true, weight: 1.0, match_value: 1.0, user_confirmed: false },
      { canonical_name: "Machine Learning", is_required: true, weight: 1.3, match_value: 0.5, user_confirmed: false },
      { canonical_name: "Large Language Models (LLMs)", is_required: true, weight: 1.5, match_value: 0.0, user_confirmed: false },
      { canonical_name: "Docker", is_required: false, weight: 1.0, match_value: 1.0, user_confirmed: true },
      { canonical_name: "PostgreSQL", is_required: false, weight: 0.8, match_value: 0.0, user_confirmed: false },
    ];
    candidateStorage["careergap_latest_analysis"] = JSON.stringify({ skills: extractedSkills });

    // Step 3: Compute transparent match report
    const scoreResult = computeScore(extractedSkills);
    expect(scoreResult.requiredCoverage).toBeGreaterThan(0);
    expect(scoreResult.preferredCoverage).toBeGreaterThan(0);
    expect(scoreResult.overallScore).toBeGreaterThan(0);

    const matchReport = {
      match_id: "match_journey_test_123",
      role_title: "AI Engineer",
      overall_score: scoreResult.overallScore,
      required_coverage: scoreResult.requiredCoverage,
      preferred_coverage: scoreResult.preferredCoverage,
      matched_skills_count: 3,
      partial_skills_count: 1,
      missing_required_count: 1,
      missing_preferred_count: 1,
      skill_gaps: [
        {
          canonical_name: "Large Language Models (LLMs)",
          is_required: true,
          importance_weight: 1.5,
          priority_rank: 1,
          suggested_action: "Build a RAG agent pipeline",
          estimated_effort_hours: 25,
        },
        {
          canonical_name: "PostgreSQL",
          is_required: false,
          importance_weight: 0.8,
          priority_rank: 2,
          suggested_action: "Deploy relational vector database",
          estimated_effort_hours: 15,
        },
      ],
    };
    candidateStorage["careergap_latest_match"] = JSON.stringify(matchReport);

    // Step 4: Generate Personalized Roadmap based on study budget
    const weeklyHours = userProfile.weeklyHours;
    const totalGapHours = matchReport.skill_gaps.reduce((acc, g) => acc + g.estimated_effort_hours, 0); // 40 hrs
    const estimatedWeeks = Math.ceil(totalGapHours / weeklyHours); // 40 / 12 = 4 weeks

    const roadmap = {
      id: "rdm_journey_test_456",
      title: "Personalized Career Acceleration: AI Engineer",
      target_role: "AI Engineer",
      weekly_hours: weeklyHours,
      total_estimated_hours: totalGapHours,
      estimated_duration_weeks: estimatedWeeks,
      completed_tasks_count: 0,
      total_tasks_count: 2,
      phases: [
        {
          id: "p1",
          phase_number: 1,
          title: "Foundations & Core Gaps",
          tasks: [
            {
              id: "t1",
              title: "Learn Transformer Architectures & RAG",
              target_skill: "Large Language Models (LLMs)",
              is_completed: false,
              estimated_hours: 25,
            },
            {
              id: "t2",
              title: "Schema Design with PostgreSQL",
              target_skill: "PostgreSQL",
              is_completed: false,
              estimated_hours: 15,
            },
          ],
        },
      ],
    };
    candidateStorage["careergap_latest_roadmap"] = JSON.stringify(roadmap);

    // Step 5: Candidate completes a learning task
    roadmap.phases[0].tasks[0].is_completed = true;
    roadmap.completed_tasks_count = 1;
    candidateStorage["careergap_latest_roadmap"] = JSON.stringify(roadmap);

    const reloadedRoadmap = JSON.parse(candidateStorage["careergap_latest_roadmap"]);
    expect(reloadedRoadmap.completed_tasks_count).toBe(1);
    expect(reloadedRoadmap.phases[0].tasks[0].is_completed).toBe(true);
    expect(reloadedRoadmap.phases[0].tasks[1].is_completed).toBe(false);

    // Step 6: Candidate data purge / deletion
    delete candidateStorage["careergap_latest_analysis"];
    delete candidateStorage["careergap_latest_match"];
    delete candidateStorage["careergap_latest_roadmap"];
    expect(candidateStorage["careergap_latest_analysis"]).toBeUndefined();
    expect(candidateStorage["careergap_latest_roadmap"]).toBeUndefined();
  });
});
