#!/usr/bin/env node
// gp-ci-gate.js — comprehensive CI gate that combines health + verify + GP tests
// Exit 0 only if ALL critical checks pass. Used in CI and before deploys.

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function run(label, cmd) {
  try {
    execSync(cmd, { encoding: 'utf8', stdio: 'pipe', cwd: ROOT });
    console.log(`  PASS: ${label}`);
    return true;
  } catch (e) {
    const out = (e.stdout || '') + (e.stderr || '');
    console.log(`  FAIL: ${label}`);
    console.log(`    ${out.trim().split('\n')[0]}`);
    return false;
  }
}

console.log('\n=== GP CI GATE ===');
console.log(`Time: ${new Date().toISOString()}\n`);

const gates = [
  // Critical: must pass before any deploy
  ['health-gate (11 checks)', 'node scripts/gp-exam-health.js'],
  ['verify-baseline (3337 checks)', 'node tests/verify-practice-exams.js'],
  ['all-json-valid', 'node tests/gp-all-json-valid.test.js'],
  ['no-null-fields', 'node tests/gp-no-null-fields.test.js'],
  ['question-count (15 per exam)', 'node tests/gp-rp-question-count.test.js'],
  ['question-ids-unique', 'node tests/gp-no-duplicate-question-ids.test.js'],
  ['question-html-nonempty', 'node tests/gp-question-html-no-raw-text.test.js'],
  ['valid-question-types', 'node tests/gp-valid-question-types.test.js'],
  ['manifest-sync', 'node scripts/gp-exam-manifest-check.js'],
  ['input-type-whitelist', 'node tests/gp-input-type-whitelist.test.js'],
  ['numeric-answers-finite', 'node tests/gp-numeric-answer-is-finite.test.js'],
  ['solution-steps-present', 'node tests/gp-solution-steps-min-one.test.js'],
  ['exam-metadata', 'node tests/gp-rp-has-exam-metadata.test.js'],
  ['section-distribution', 'node tests/gp-section-distribution.test.js'],
  ['feedback-present', 'node tests/gp-feedback-present.test.js'],
  ['hint-present', 'node tests/gp-hint-count-check.test.js'],
];

let passCount = 0;
let failCount = 0;

for (const [label, cmd] of gates) {
  const ok = run(label, cmd);
  if (ok) passCount++; else failCount++;
}

console.log(`\n=== CI GATE RESULT: ${passCount}/${passCount + failCount} pass ===`);
if (failCount > 0) {
  console.log(`BLOCKED: ${failCount} gate(s) failed — do not deploy`);
  process.exit(1);
}
console.log('ALL GATES PASS — safe to deploy');
process.exit(0);
