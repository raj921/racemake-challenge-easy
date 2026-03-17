import type {
  ReferenceLap,
  DriverLap,
  Config,
  CoachingOutput,
  StintTrend,
  StintSummary,
  LapAnalysis,
} from "./types";
import { analyzeLap } from "./analysis";
import { generateCoaching } from "./coach";

function detectTrend(
  progression: StintTrend["issueProgression"]
): string {
  const first = progression[0];
  const last = progression[progression.length - 1];
  const deltaGrowth = last.delta - first.delta;
  const issueChanged = first.issue !== last.issue;

  if (issueChanged) {
    return `Issue shifted from ${first.issue} (lap ${first.stintLap}) to ${last.issue} (lap ${last.stintLap}). Delta grew +${deltaGrowth.toFixed(3)}s.`;
  }

  if (deltaGrowth > 0.5) {
    return `${last.issue} worsening across stint — delta grew +${deltaGrowth.toFixed(3)}s from lap ${first.stintLap} to ${last.stintLap}.`;
  }

  if (deltaGrowth < -0.1) {
    return `${last.issue} improving — delta shrank ${deltaGrowth.toFixed(3)}s.`;
  }

  return `${last.issue} stable across stint.`;
}

function buildStintNarrative(trends: StintTrend[], config: Config): string {
  if (trends.length === 0) return "Not enough data for stint analysis.";

  const lines: string[] = [];

  for (const t of trends) {
    const first = t.issueProgression[0];
    const last = t.issueProgression[t.issueProgression.length - 1];

    if (config.coachVoice === "pitgpt") {
      if (first.issue !== last.issue) {
        lines.push(
          `Sector ${t.sector}: Started with ${first.issue}, now it's ${last.issue}. Tyres are going away — adapt your inputs.`
        );
      } else if (last.delta - first.delta > 0.5) {
        lines.push(
          `Sector ${t.sector}: ${last.issue} is getting worse. You're losing more time every lap. Manage the tyres or you'll eat through this stint.`
        );
      } else {
        lines.push(
          `Sector ${t.sector}: Holding steady. Keep doing what you're doing.`
        );
      }
    } else {
      lines.push(`Sector ${t.sector}: ${t.trend}`);
    }
  }

  return lines.join("\n");
}

export function analyzeStint(
  reference: ReferenceLap,
  laps: DriverLap[],
  config: Config
): StintSummary {
  const lapAnalyses: { stintLap: number; coaching: CoachingOutput }[] = [];
  const allAnalyses: LapAnalysis[] = [];

  for (const lap of laps) {
    const analysis = analyzeLap(reference, lap);
    const coaching = generateCoaching(analysis, config);
    lapAnalyses.push({ stintLap: lap.stintLap ?? 0, coaching });
    allAnalyses.push(analysis);
  }

  const sectorKeys = Object.keys(reference.sectors);
  const trends: StintTrend[] = [];

  for (const key of sectorKeys) {
    const sectorNum = parseInt(key.replace("s", ""));
    const progression: StintTrend["issueProgression"] = [];

    for (let i = 0; i < allAnalyses.length; i++) {
      const finding = allAnalyses[i].findings.find((f) => f.sectorKey === key);
      if (finding) {
        progression.push({
          stintLap: laps[i].stintLap ?? i + 1,
          issue: finding.issue,
          delta: finding.delta,
        });
      }
    }

    if (progression.length < 2) continue;

    const trend = detectTrend(progression);
    trends.push({ sector: sectorNum, sectorKey: key, issueProgression: progression, trend });
  }

  const summary = buildStintNarrative(trends, config);

  return { lapAnalyses, trends, summary };
}
