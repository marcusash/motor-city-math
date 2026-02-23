/**
 * question-type-coverage.test.js
 * GF gf-skill-17: Validates question-type coverage across all RP exams.
 * Guards against coverage regressions where question types drop to zero
 * or core types go missing.
 *
 * Thresholds are based on the 2026-02-23 baseline across RP1-RP9.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');

let passed = 0;
let failed = 0;

function pass(msg) {
  console.log(`  \u2713 ${msg}`);
  passed++;
}

function fail(msg) {
  console.error(`  \u2717 FAIL: ${msg}`);
  failed++;
}

// Core types that MUST appear in every 9-exam set.
// If any drops to 0, Kai is missing practice on that skill.
const REQUIRED_TYPES = [
  'exponential',   // core unit skill
  'quadratic',     // core unit skill
  'radical',       // core unit skill
  'rational',      // core unit skill
  'graph',         // graphing standard
  'word-problem',  // application standard
];

// Minimum count floor across all exams (not per-exam).
// Below this signals a coverage gap that warrants GR attention.
const MIN_COUNT = {
  exponential: 15,
  quadratic: 8,
  radical: 10,
  rational: 6,
  graph: 12,
  'word-problem': 6,
};

console.log('\nQuestion Type Coverage Report\n');

// Load all RP exam files
const examFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.startsWith('retake-practice') && f.endsWith('.json'))
  .sort();

if (examFiles.length === 0) {
  fail('no retake-practice*.json files found in data/');
  process.exit(1);
}

pass(`found ${examFiles.length} exam file(s)`);

// Build type coverage map
const typeCounts = {};
const typeByExam = {}; // { type: Set of exam files containing it }
let totalQuestions = 0;

for (const file of examFiles) {
  const fullPath = path.join(DATA_DIR, file);
  let exam;
  try {
    exam = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (e) {
    fail(`${file}: JSON parse error — ${e.message}`);
    continue;
  }

  const questions = exam.questions || [];
  totalQuestions += questions.length;

  for (const q of questions) {
    const types = q.parts
      ? q.parts.map(p => p.type || 'unknown')
      : [q.type || 'unknown'];

    for (const t of types) {
      typeCounts[t] = (typeCounts[t] || 0) + 1;
      if (!typeByExam[t]) typeByExam[t] = new Set();
      typeByExam[t].add(file);
    }
  }
}

pass(`total questions scanned: ${totalQuestions}`);

// Print coverage table
const allTypes = Object.keys(typeCounts).sort();
console.log(`\n  ${'Type'.padEnd(22)} ${'Count'.padStart(6)}  ${'Exams'.padStart(6)}`);
console.log(`  ${'-'.repeat(22)} ${'-'.repeat(6)}  ${'-'.repeat(6)}`);
for (const t of allTypes) {
  const count = typeCounts[t];
  const examCount = typeByExam[t] ? typeByExam[t].size : 0;
  console.log(`  ${t.padEnd(22)} ${String(count).padStart(6)}  ${String(examCount).padStart(6)} exams`);
}

// Check required types present
console.log('\n  Required type checks:');
for (const reqType of REQUIRED_TYPES) {
  const count = typeCounts[reqType] || 0;
  if (count === 0) {
    fail(`required type "${reqType}" has 0 questions — coverage gap`);
  } else {
    pass(`${reqType}: ${count} question(s) across ${typeByExam[reqType].size} exam(s)`);
  }
}

// Check minimum count floors
console.log('\n  Minimum count floor checks:');
for (const [type, min] of Object.entries(MIN_COUNT)) {
  const count = typeCounts[type] || 0;
  if (count < min) {
    fail(`${type}: ${count} questions (min: ${min}) — below coverage floor`);
  } else {
    pass(`${type}: ${count} >= ${min} minimum`);
  }
}

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`${passed + failed} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\u2718 FAIL');
  process.exit(1);
} else {
  console.log('\u2714 PASS');
}
