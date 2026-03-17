/**
 * 🏁 RACEMAKE PRODUCT ENGINEER CHALLENGE 🏁
 *
 * Level 1 — Fix:  Sort bug fixed (descending), coachVoice set to "pitgpt"
 * Level 2 — Extend: Stint analysis across multiple laps with trend detection
 * Level 3 — Think: See SCALING.md or the header comment in challenge.ts
 */

import type { Config } from "./types";
import { referenceLap, driverLap, driverLap2 } from "./data";
import { analyzeLap } from "./analysis";
import { generateCoaching } from "./coach";
import { analyzeStint } from "./stint";

const config: Config = {
  coachVoice: "pitgpt",
  units: "metric",
};

// --- Level 1: Single-lap analysis ---
console.log("=== LEVEL 1 — Single Lap Analysis ===\n");

const analysis = analyzeLap(referenceLap, driverLap);
const result = generateCoaching(analysis, config);

console.log("--- PitGPT Lap Analysis ---");
console.log(JSON.stringify(result, null, 2));
console.log("---------------------------");

const checks = [
  { name: "problemSector", pass: result.problemSector === 2 },
  {
    name: "issue",
    pass: (["late_braking", "traction_loss"] as string[]).includes(result.issue),
  },
  { name: "timeLost", pass: Math.abs(result.timeLost - 1.198) < 0.01 },
  {
    name: "coachingMessage",
    pass:
      typeof result.coachingMessage === "string" &&
      result.coachingMessage.length > 20,
  },
];

checks.forEach((c) => console.log(`${c.pass ? "✅" : "❌"} ${c.name}`));

if (checks.every((c) => c.pass)) {
  console.log("\n✅ Analysis correct.");
} else {
  console.log("\n❌ Something's off. Look at the output and trace it back.");
}

// --- Level 2: Stint analysis ---
console.log("\n\n=== LEVEL 2 — Stint Analysis ===\n");

const stintResult = analyzeStint(referenceLap, [driverLap, driverLap2], config);

console.log("--- Per-Lap Coaching ---");
for (const la of stintResult.lapAnalyses) {
  console.log(`\nStint Lap ${la.stintLap}:`);
  console.log(JSON.stringify(la.coaching, null, 2));
}

console.log("\n--- Stint Trends ---");
for (const t of stintResult.trends) {
  console.log(`\nSector ${t.sector}:`);
  for (const p of t.issueProgression) {
    console.log(`  Lap ${p.stintLap}: ${p.issue} (+${p.delta.toFixed(3)}s)`);
  }
  console.log(`  → ${t.trend}`);
}

console.log("\n--- Stint Summary (PitGPT Voice) ---");
console.log(stintResult.summary);

// --- Level 3 ---
console.log("\n\n=== LEVEL 3 — Scaling Thoughts ===");
console.log("See file header comment in challenge.ts for full analysis.");
