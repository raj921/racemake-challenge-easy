import type {
  DriverSector,
  ReferenceSector,
  ReferenceLap,
  DriverLap,
  Issue,
  SectorFinding,
  LapAnalysis,
} from "./types";

/**
 * Detect the primary issue in a sector by examining telemetry clues.
 *
 * Priority order:
 *   1. early_lift      — lifts off throttle before braking zone
 *   2. traction_loss   — high slip + TC active + low full-throttle %
 *   3. late_braking    — brakes significantly later than reference
 *   4. overcorrection  — high avg slip without TC
 */
export function detectIssue(
  driverSector: DriverSector,
  refSector: ReferenceSector
): { issue: Issue; details: string } {
  const { brakingPoints, tyreData, throttleTrace } = driverSector;

  if (throttleTrace.earlyLift) {
    return {
      issue: "early_lift",
      details: `Throttle lift detected before braking zone. Full throttle: ${(throttleTrace.fullThrottlePercent * 100).toFixed(0)}%`,
    };
  }

  const hasTcActivation = brakingPoints.some((bp) => bp.tcActive);
  const highSlip = tyreData.peakSlip > 0.1;
  const lowThrottle = throttleTrace.fullThrottlePercent < 0.7;

  if (hasTcActivation && highSlip && lowThrottle) {
    return {
      issue: "traction_loss",
      details: `TC active, peak slip ${tyreData.peakSlip.toFixed(3)}, full throttle only ${(throttleTrace.fullThrottlePercent * 100).toFixed(0)}%`,
    };
  }

  for (let i = 0; i < driverSector.brakingPoints.length; i++) {
    const driverBp = driverSector.brakingPoints[i];
    const refBp = refSector.brakingPoints[i];
    if (refBp && driverBp.brakeMarker < refBp.brakeMarker - 8) {
      return {
        issue: "late_braking",
        details: `${driverBp.turn}: braked at ${driverBp.brakeMarker}m vs reference ${refBp.brakeMarker}m`,
      };
    }
  }

  if (tyreData.avgSlip > 0.05 && !hasTcActivation) {
    return {
      issue: "overcorrection",
      details: `High average slip ${tyreData.avgSlip.toFixed(3)} without TC — likely excessive steering input`,
    };
  }

  return {
    issue: "late_braking",
    details: "No single clear cause — general time loss through sector",
  };
}

/**
 * Analyze a driver lap against a reference lap.
 * Returns findings for each sector, sorted by time lost (worst first).
 */
export function analyzeLap(
  reference: ReferenceLap,
  driver: DriverLap
): LapAnalysis {
  const sectorKeys = Object.keys(driver.sectors);
  const findings: SectorFinding[] = [];

  for (const key of sectorKeys) {
    const driverSector = driver.sectors[key];
    const refSector = reference.sectors[key];

    if (!driverSector || !refSector) continue;

    const sectorNum = parseInt(key.replace("s", ""));
    const { issue, details } = detectIssue(driverSector, refSector);

    findings.push({
      sector: sectorNum,
      sectorKey: key,
      delta: driverSector.delta,
      issue,
      details,
    });
  }

  // Sort descending — worst sector (highest delta) first.
  // Original bug sorted ascending, which surfaced the best sector instead.
  findings.sort((a, b) => b.delta - a.delta);

  const totalDelta = findings.reduce((sum, f) => sum + f.delta, 0);

  return { findings, totalDelta, stintLap: driver.stintLap };
}
