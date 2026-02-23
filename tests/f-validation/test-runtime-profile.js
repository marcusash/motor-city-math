#!/usr/bin/env node
/**
 * test-runtime-profile.js
 * GF gf-skill-15: Times each static test suite and reports results sorted by duration.
 * Run from repo root: node tests/f-validation/test-runtime-profile.js
 *
 * Purpose: surface slow tests before they become CI blockers, and track runtime
 * trends over time. Flags any suite taking > 5s as a candidate for optimization.
 */

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SUITE_DIR = path.resolve(__dirname);
const SLOW_THRESHOLD_MS = 5000;
const REPORT_PATH = path.resolve(__dirname, '..', 'runtime-profile.json');

// Static test suites only (no .spec.js — those require Playwright runtime)
const suites = fs.readdirSync(SUITE_DIR)
  .filter(f => f.endsWith('.test.js') && f !== 'test-runtime-profile.js')
  .sort();

console.log(`\nTest Runtime Profile — ${new Date().toISOString().split('T')[0]}\n`);
console.log(`  Profiling ${suites.length} static test suite(s)...\n`);

const results = [];

for (const suite of suites) {
  const suitePath = path.join(SUITE_DIR, suite);
  const start = Date.now();
  let exitCode = 0;
  let stderr = '';

  try {
    execSync(`node "${suitePath}"`, { stdio: 'pipe', cwd: ROOT });
  } catch (e) {
    exitCode = e.status || 1;
    stderr = e.stderr ? e.stderr.toString().split('\n')[0] : '';
  }

  const durationMs = Date.now() - start;
  results.push({ suite, durationMs, exitCode, stderr });
}

// Sort by duration descending
results.sort((a, b) => b.durationMs - a.durationMs);

// Print table
const COL_W = 48;
console.log(`  ${'Suite'.padEnd(COL_W)} ${'ms'.padStart(6)}  Status`);
console.log(`  ${'-'.repeat(COL_W)} ${'-'.repeat(6)}  ------`);

let totalMs = 0;
let failCount = 0;
let slowCount = 0;

for (const r of results) {
  totalMs += r.durationMs;
  const status = r.exitCode === 0 ? '\u2713' : '\u2717';
  const slowFlag = r.durationMs > SLOW_THRESHOLD_MS ? ' \u26A0 SLOW' : '';
  const name = r.suite.padEnd(COL_W);
  console.log(`  ${name} ${String(r.durationMs).padStart(6)}ms  ${status}${slowFlag}`);
  if (r.exitCode !== 0) failCount++;
  if (r.durationMs > SLOW_THRESHOLD_MS) slowCount++;
}

console.log(`\n  Total: ${totalMs}ms across ${results.length} suites`);
console.log(`  Failed: ${failCount} | Slow (>${SLOW_THRESHOLD_MS}ms): ${slowCount}`);

// Write JSON report
const report = {
  date: new Date().toISOString().split('T')[0],
  total_ms: totalMs,
  suite_count: results.length,
  failed_count: failCount,
  slow_count: slowCount,
  slow_threshold_ms: SLOW_THRESHOLD_MS,
  suites: results,
};

fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');
console.log(`\n  Report written: tests/runtime-profile.json\n`);

if (failCount > 0) {
  console.error(`\u2718 ${failCount} suite(s) failed`);
  process.exit(1);
} else {
  console.log('\u2714 All suites passed');
}
