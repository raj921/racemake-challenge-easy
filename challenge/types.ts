export interface BrakingPoint {
  turn: string;
  brakeMarker: number;
  trailBraking: boolean;
}

export interface DriverBrakingPoint extends BrakingPoint {
  lockup: boolean;
  tcActive: boolean;
}

export interface TyreTemps {
  fl: number;
  fr: number;
  rl: number;
  rr: number;
}

export interface TyreData {
  avgSlip: number;
  peakSlip: number;
  avgTemp: TyreTemps;
}

export interface ThrottleTrace {
  earlyLift: boolean;
  smoothApplication: boolean;
  fullThrottlePercent: number;
}

export interface ReferenceSector {
  time: number;
  brakingPoints: BrakingPoint[];
}

export interface DriverSector {
  time: number;
  delta: number;
  brakingPoints: DriverBrakingPoint[];
  tyreData: TyreData;
  throttleTrace: ThrottleTrace;
}

export interface ReferenceLap {
  track: string;
  car: string;
  totalTime: number;
  sectors: Record<string, ReferenceSector>;
}

export interface DriverLap {
  track: string;
  car: string;
  totalTime: number;
  sectors: Record<string, DriverSector>;
  stintLap?: number;
}

export type Issue = "late_braking" | "early_lift" | "traction_loss" | "overcorrection";

export interface SectorFinding {
  sector: number;
  sectorKey: string;
  delta: number;
  issue: Issue;
  details: string;
}

export interface LapAnalysis {
  findings: SectorFinding[];
  totalDelta: number;
  stintLap?: number;
}

export interface CoachingOutput {
  problemSector: number;
  issue: Issue;
  timeLost: number;
  coachingMessage: string;
}

export interface StintTrend {
  sector: number;
  sectorKey: string;
  issueProgression: { stintLap: number; issue: Issue; delta: number }[];
  trend: string;
}

export interface StintSummary {
  lapAnalyses: { stintLap: number; coaching: CoachingOutput }[];
  trends: StintTrend[];
  summary: string;
}

export interface Config {
  coachVoice: "generic" | "pitgpt";
  units: "metric" | "imperial";
}
