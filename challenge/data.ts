import type { ReferenceLap, DriverLap } from "./types";

// Spa-Francorchamps, LMU — Porsche 963 LMdh | Dry, 24°C track

export const referenceLap: ReferenceLap = {
  track: "Spa-Francorchamps",
  car: "Porsche 963 LMdh",
  totalTime: 133.412,
  sectors: {
    s1: {
      time: 41.203,
      brakingPoints: [
        { turn: "T1 La Source", brakeMarker: 92, trailBraking: true },
      ],
    },
    s2: {
      time: 48.887,
      brakingPoints: [
        { turn: "T6 Rivage", brakeMarker: 68, trailBraking: true },
        { turn: "T10 Pouhon", brakeMarker: 44, trailBraking: true },
      ],
    },
    s3: {
      time: 43.322,
      brakingPoints: [
        { turn: "T14 Stavelot", brakeMarker: 55, trailBraking: true },
        { turn: "T18 Bus Stop", brakeMarker: 78, trailBraking: false },
      ],
    },
  },
};

export const driverLap: DriverLap = {
  track: "Spa-Francorchamps",
  car: "Porsche 963 LMdh",
  totalTime: 135.067,
  stintLap: 3,
  sectors: {
    s1: {
      time: 41.59,
      delta: +0.387,
      brakingPoints: [
        { turn: "T1 La Source", brakeMarker: 89, trailBraking: true, lockup: false, tcActive: false },
      ],
      tyreData: { avgSlip: 0.032, peakSlip: 0.071, avgTemp: { fl: 94, fr: 97, rl: 91, rr: 92 } },
      throttleTrace: { earlyLift: false, smoothApplication: true, fullThrottlePercent: 0.78 },
    },
    s2: {
      time: 50.085,
      delta: +1.198,
      brakingPoints: [
        { turn: "T6 Rivage", brakeMarker: 56, trailBraking: false, lockup: false, tcActive: true },
        { turn: "T10 Pouhon", brakeMarker: 41, trailBraking: true, lockup: false, tcActive: false },
      ],
      tyreData: { avgSlip: 0.058, peakSlip: 0.134, avgTemp: { fl: 101, fr: 104, rl: 97, rr: 99 } },
      throttleTrace: { earlyLift: false, smoothApplication: false, fullThrottlePercent: 0.62 },
    },
    s3: {
      time: 43.392,
      delta: +0.07,
      brakingPoints: [
        { turn: "T14 Stavelot", brakeMarker: 54, trailBraking: true, lockup: false, tcActive: false },
        { turn: "T18 Bus Stop", brakeMarker: 76, trailBraking: false, lockup: false, tcActive: false },
      ],
      tyreData: { avgSlip: 0.029, peakSlip: 0.065, avgTemp: { fl: 93, fr: 96, rl: 90, rr: 91 } },
      throttleTrace: { earlyLift: false, smoothApplication: true, fullThrottlePercent: 0.81 },
    },
  },
};

// Stint lap 14 — degraded tyres, driver managing pace
export const driverLap2: DriverLap = {
  track: "Spa-Francorchamps",
  car: "Porsche 963 LMdh",
  totalTime: 136.841,
  stintLap: 14,
  sectors: {
    s1: {
      time: 42.105,
      delta: +0.902,
      brakingPoints: [
        { turn: "T1 La Source", brakeMarker: 96, trailBraking: false, lockup: false, tcActive: false },
      ],
      tyreData: { avgSlip: 0.041, peakSlip: 0.088, avgTemp: { fl: 99, fr: 103, rl: 96, rr: 98 } },
      throttleTrace: { earlyLift: true, smoothApplication: true, fullThrottlePercent: 0.71 },
    },
    s2: {
      time: 51.203,
      delta: +2.316,
      brakingPoints: [
        { turn: "T6 Rivage", brakeMarker: 61, trailBraking: false, lockup: true, tcActive: true },
        { turn: "T10 Pouhon", brakeMarker: 48, trailBraking: false, lockup: false, tcActive: true },
      ],
      tyreData: { avgSlip: 0.079, peakSlip: 0.168, avgTemp: { fl: 108, fr: 112, rl: 104, rr: 107 } },
      throttleTrace: { earlyLift: false, smoothApplication: false, fullThrottlePercent: 0.49 },
    },
    s3: {
      time: 43.533,
      delta: +0.211,
      brakingPoints: [
        { turn: "T14 Stavelot", brakeMarker: 58, trailBraking: true, lockup: false, tcActive: false },
        { turn: "T18 Bus Stop", brakeMarker: 81, trailBraking: false, lockup: false, tcActive: true },
      ],
      tyreData: { avgSlip: 0.044, peakSlip: 0.091, avgTemp: { fl: 101, fr: 105, rl: 98, rr: 100 } },
      throttleTrace: { earlyLift: true, smoothApplication: true, fullThrottlePercent: 0.68 },
    },
  },
};
