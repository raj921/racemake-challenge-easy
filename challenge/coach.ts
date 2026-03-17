import type { SectorFinding, LapAnalysis, CoachingOutput, Config } from "./types";

function generateGenericMessage(finding: SectorFinding): string {
  const sector = `Sector ${finding.sector}`;
  const delta = `+${finding.delta.toFixed(3)}s`;

  switch (finding.issue) {
    case "late_braking":
      return `${sector} (${delta}): Late braking detected. ${finding.details}. Consider matching reference braking points for more consistent sector times.`;
    case "early_lift":
      return `${sector} (${delta}): Early throttle lift detected. ${finding.details}. Maintain full throttle deeper into the braking zone.`;
    case "traction_loss":
      return `${sector} (${delta}): Traction loss identified. ${finding.details}. Reduce throttle application rate on corner exit.`;
    case "overcorrection":
      return `${sector} (${delta}): Overcorrection detected. ${finding.details}. Reduce steering input to lower tyre scrub.`;
  }
}

function generatePitGPTMessage(finding: SectorFinding): string {
  const delta = `${finding.delta.toFixed(3)}`;

  switch (finding.issue) {
    case "late_braking":
      return `You're losing ${delta} in sector ${finding.sector}. ${finding.details}. You're overdriving it — brake earlier, carry more speed through the apex. The time is in the exit, not the entry.`;
    case "early_lift":
      return `Sector ${finding.sector}, ${delta} off. You're lifting before the braking zone — keep your foot in, trust the car. That lift is costing you straight-line speed into the corner.`;
    case "traction_loss":
      return `Sector ${finding.sector} is where the lap falls apart — ${delta} lost. TC is fighting you, tyres are sliding. Smooth the throttle on exit. Don't ask for grip that isn't there.`;
    case "overcorrection":
      return `${delta} gone in sector ${finding.sector}. You're sawing at the wheel — the slip numbers show it. Less steering, let the front bite. The car wants to turn, stop fighting it.`;
  }
}

export function generateMessage(finding: SectorFinding, config: Config): string {
  if (config.coachVoice === "pitgpt") {
    return generatePitGPTMessage(finding);
  }
  return generateGenericMessage(finding);
}

export function generateCoaching(
  analysis: LapAnalysis,
  config: Config
): CoachingOutput {
  const worst = analysis.findings[0];

  if (!worst) {
    return {
      problemSector: 0,
      issue: "late_braking",
      timeLost: 0,
      coachingMessage: "No significant issues found. Clean lap.",
    };
  }

  return {
    problemSector: worst.sector,
    issue: worst.issue,
    timeLost: worst.delta,
    coachingMessage: generateMessage(worst, config),
  };
}
