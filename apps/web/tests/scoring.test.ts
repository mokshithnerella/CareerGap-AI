import { describe, it, expect } from "vitest";

// Pure TypeScript implementation of the deterministic scoring formula for validation
export function computeScore(
  requirements: Array<{ is_required: boolean; weight: number; match_value: number }>
) {
  const reqItems = requirements.filter((r) => r.is_required);
  const prefItems = requirements.filter((r) => !r.is_required);

  const reqWeightSum = reqItems.reduce((acc, curr) => acc + curr.weight, 0);
  const reqValueSum = reqItems.reduce((acc, curr) => acc + curr.weight * curr.match_value, 0);

  const prefWeightSum = prefItems.reduce((acc, curr) => acc + curr.weight, 0);
  const prefValueSum = prefItems.reduce((acc, curr) => acc + curr.weight * curr.match_value, 0);

  const requiredCoverage = reqWeightSum > 0 ? (100 * reqValueSum) / reqWeightSum : 0;
  const preferredCoverage = prefWeightSum > 0 ? (100 * prefValueSum) / prefWeightSum : 0;

  let overallScore = 0;
  if (reqWeightSum > 0 && prefWeightSum > 0) {
    overallScore = 0.80 * requiredCoverage + 0.20 * preferredCoverage;
  } else if (reqWeightSum > 0) {
    overallScore = requiredCoverage;
  } else if (prefWeightSum > 0) {
    overallScore = preferredCoverage;
  }

  return {
    requiredCoverage: Math.round(requiredCoverage * 10) / 10,
    preferredCoverage: Math.round(preferredCoverage * 10) / 10,
    overallScore: Math.round(overallScore * 10) / 10,
  };
}

describe("Deterministic Scoring Engine Formula", () => {
  it("calculates 100% when all required and preferred criteria are satisfied", () => {
    const reqs = [
      { is_required: true, weight: 1.5, match_value: 1.0 },
      { is_required: true, weight: 1.0, match_value: 1.0 },
      { is_required: false, weight: 1.0, match_value: 1.0 },
    ];
    const score = computeScore(reqs);
    expect(score.requiredCoverage).toBe(100);
    expect(score.preferredCoverage).toBe(100);
    expect(score.overallScore).toBe(100);
  });

  it("applies 80/20 ratio for required vs preferred requirements", () => {
    // Required: 1 item weight 1.0, match 1.0 -> 100%
    // Preferred: 1 item weight 1.0, match 0.0 -> 0%
    // Overall: 0.80 * 100 + 0.20 * 0 = 80%
    const reqs = [
      { is_required: true, weight: 1.0, match_value: 1.0 },
      { is_required: false, weight: 1.0, match_value: 0.0 },
    ];
    const score = computeScore(reqs);
    expect(score.requiredCoverage).toBe(100);
    expect(score.preferredCoverage).toBe(0);
    expect(score.overallScore).toBe(80);
  });

  it("handles partial credit accurately (0.5 value)", () => {
    // Required: 1 item weight 2.0, match 0.5 -> 50% coverage
    // Preferred: none -> overall = 50%
    const reqs = [{ is_required: true, weight: 2.0, match_value: 0.5 }];
    const score = computeScore(reqs);
    expect(score.requiredCoverage).toBe(50);
    expect(score.overallScore).toBe(50);
  });

  it("handles zero requirements safely without dividing by zero", () => {
    const score = computeScore([]);
    expect(score.requiredCoverage).toBe(0);
    expect(score.preferredCoverage).toBe(0);
    expect(score.overallScore).toBe(0);
  });

  it("calculates realistic roadmap duration based on weekly hours and total hours", () => {
    function estimateDurationWeeks(totalHours: number, weeklyHours: number): number {
      const safeWeekly = Math.max(2, Math.min(40, weeklyHours));
      return Math.max(1, Math.ceil(totalHours / safeWeekly));
    }

    expect(estimateDurationWeeks(120, 10)).toBe(12);
    expect(estimateDurationWeeks(40, 20)).toBe(2);
    expect(estimateDurationWeeks(50, 15)).toBe(4);
    // Boundary checks
    expect(estimateDurationWeeks(10, 0)).toBe(5); // clamps min 2
    expect(estimateDurationWeeks(100, 100)).toBe(3); // clamps max 40
  });

  it("prioritizes skill gaps accurately based on prerequisite dependencies", () => {
    interface Gap {
      skill: string;
      prerequisites: string[];
      importance: number;
    }

    function sortGaps(gaps: Gap[]): Gap[] {
      return [...gaps].sort((a, b) => {
        // If a is prerequisite of b, a should come first
        if (b.prerequisites.includes(a.skill)) return -1;
        if (a.prerequisites.includes(b.skill)) return 1;
        return b.importance - a.importance;
      });
    }

    const testGaps: Gap[] = [
      { skill: "TypeScript", prerequisites: ["JavaScript"], importance: 1.4 },
      { skill: "JavaScript", prerequisites: [], importance: 1.5 },
      { skill: "Next.js", prerequisites: ["React", "TypeScript"], importance: 1.3 },
    ];

    const sorted = sortGaps(testGaps);
    expect(sorted[0].skill).toBe("JavaScript");
  });
});
