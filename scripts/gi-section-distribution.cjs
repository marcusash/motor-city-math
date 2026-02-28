#!/usr/bin/env node
/**
 * gi-section-distribution.cjs
 * Validates that every exam uses a consistent A/B/C/D section distribution.
 * Reports per-exam section counts and flags any exam where:
 *   - Any question has an unrecognized section
 *   - Section distribution differs significantly from the median
 * Usage: node scripts/gi-section-distribution.cjs [--json]
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT     = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const JSON_OUT = process.argv.includes('--json');

const VALID_SECTIONS = new Set(['A', 'B', 'C', 'D']);

// ── load all exams ─────────────────────────────────────────────────────────

const exams = [];
for (let i = 1; i <= 15; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (fs.existsSync(f)) {
    exams.push({ id: `RP${i}`, ...JSON.parse(fs.readFileSync(f, 'utf8')) });
  }
}

// ── per-exam section counts ────────────────────────────────────────────────

const results  = [];
let   anyError = false;

for (const exam of exams) {
  const counts = { A: 0, B: 0, C: 0, D: 0, unknown: 0 };
  const unknownSections = [];

  for (const q of exam.questions || []) {
    const sec = (q.section || '').toUpperCase();
    if (VALID_SECTIONS.has(sec)) {
      counts[sec]++;
    } else {
      counts.unknown++;
      unknownSections.push(`Q${q.number}="${q.section}"`);
    }
  }

  const errors = [];
  if (counts.unknown > 0) {
    errors.push(`unknown sections: ${unknownSections.join(', ')}`);
    anyError = true;
  }

  results.push({ id: exam.id, counts, errors });
}

// ── compute median distribution ────────────────────────────────────────────

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const medA = median(results.map(r => r.counts.A));
const medB = median(results.map(r => r.counts.B));
const medC = median(results.map(r => r.counts.C));
const medD = median(results.map(r => r.counts.D));

// Flag exams that deviate >1 from median in any section
for (const r of results) {
  const deviations = [];
  if (Math.abs(r.counts.A - medA) > 1) deviations.push(`A=${r.counts.A} (median ${medA})`);
  if (Math.abs(r.counts.B - medB) > 1) deviations.push(`B=${r.counts.B} (median ${medB})`);
  if (Math.abs(r.counts.C - medC) > 1) deviations.push(`C=${r.counts.C} (median ${medC})`);
  if (Math.abs(r.counts.D - medD) > 1) deviations.push(`D=${r.counts.D} (median ${medD})`);
  if (deviations.length > 0) {
    r.errors.push(`section deviation: ${deviations.join(', ')}`);
  }
}

// ── output ─────────────────────────────────────────────────────────────────

if (JSON_OUT) {
  console.log(JSON.stringify({ exams: results, median: { A: medA, B: medB, C: medC, D: medD } }, null, 2));
  process.exit(anyError ? 1 : 0);
}

console.log('\nSection Distribution Report');
console.log('===========================\n');
console.log(`Median distribution: A=${medA}  B=${medB}  C=${medC}  D=${medD}\n`);

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad('Exam', 6)} ${pad('A', 4)} ${pad('B', 4)} ${pad('C', 4)} ${pad('D', 4)} Errors`);
console.log('-'.repeat(60));

for (const r of results) {
  const errStr = r.errors.length ? r.errors.join(' | ') : 'OK';
  console.log(
    `${pad(r.id, 6)} ${pad(r.counts.A, 4)} ${pad(r.counts.B, 4)} ${pad(r.counts.C, 4)} ${pad(r.counts.D, 4)} ${errStr}`
  );
}

console.log('');
if (anyError) {
  console.log('RESULT: Errors found — see above.');
  process.exit(1);
} else {
  console.log('RESULT: All exams have valid sections.');
  process.exit(0);
}
