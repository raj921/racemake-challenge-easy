/**
 * 🏁 RACEMAKE PRODUCT ENGINEER CHALLENGE 🏁
 *
 * LEVEL 3 — SCALING THOUGHTS
 * --------------------------
 * Right now this processes one car's data. In production, PitGPT handles
 * full sessions — 20+ cars, 50+ laps each, telemetry streaming at 120 Hz.
 *
 * What breaks first:
 *   1. Memory — 120 Hz × 20 cars × ~90s laps × 50 laps ≈ 10M+ frames in-process.
 *      In-memory storage collapses. Move to a time-series DB (TimescaleDB or QuestDB)
 *      or a ring buffer per car that flushes completed laps to disk.
 *
 *   2. Latency — analyzeLap is synchronous and runs in the request path.
 *      At 20 cars it's fine; at scale you need a message queue (NATS, Redis Streams)
 *      so ingest and analysis decouple. Ingest writes, a worker pool consumes.
 *
 *   3. Sector interpolation — the linear interpolation between two frames is cheap
 *      but becomes a bottleneck when you're scanning 10M frames. Pre-compute sector
 *      boundaries on ingest (streaming reducer) instead of on read.
 *
 *   4. Concurrency — Bun is single-threaded by default. Use Bun.spawn workers or
 *      run multiple instances behind a load balancer. Partition by car ID.
 *
 *   5. Coaching generation — per-lap is fine, but stint-level patterns (degradation
 *      curves, fuel-adjusted pace) need a second pass over aggregated data.
 *      That pass should be async and cached per stint window.
 *
 * What I'd change:
 *   - Ingest → append to per-car stream in Redis/NATS
 *   - Worker reads completed laps, runs analysis, writes results to Postgres
 *   - API reads from Postgres (cached), never touches raw frames on GET
 *   - Coaching runs as a separate service consuming analysis events
 */

import "./challenge/index";
