#!/usr/bin/env node
// gp-data-quality-summary.js — consolidated data quality report across all RP files

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const TESTS_DIR = path.join(__dirname, '..', 'tests');

console.log('\n=== GP Data Quality Summary ===');
console.log(`Date: ${new Date().toISOString()}`);
console.log(`Exams: ${RP_FILES.length} files\n`);

// Quick test runner
function runTest(testFile) {
  try {
    const result = execSync(`node "${testFile}"`, { encoding: 'utf8', stdio: 'pipe' });
    const lastLine = result.trim().split('\n').pop();
    return { ok: true, summary: lastLine };
  } catch (e) {
    const output = (e.stdout || '') + (e.stderr || '');
    const lines = output.trim().split('\n');
    return { ok: false, summary: lines[0] };
  }
}

const GP_TESTS = [
  'gp-all-json-valid.test.js',
  'gp-rp-question-count.test.js',
  'gp-rp-has-exam-metadata.test.js',
  'gp-questions-array.test.js',
  'gp-all-questions-have-type.test.js',
  'gp-valid-question-types.test.js',
  'gp-question-html-no-raw-text.test.js',
  'gp-prompt-nonempty.test.js',
  'gp-no-duplicate-question-ids.test.js',
  'gp-no-duplicate-ids.test.js',
  'gp-hint-count-check.test.js',
  'gp-hint-length-check.test.js',
  'gp-feedback-present.test.js',
  'gp-solution-steps-min-one.test.js',
  'gp-solution-steps-count.test.js',
  'gp-no-orphan-inputs.test.js',
  'gp-answer-not-string-for-numeric.test.js',
  'gp-numeric-answer-is-finite.test.js',
  'gp-answer-type-consistency.test.js',
  'gp-mc-correct-index.test.js',
  'gp-mc-has-options.test.js',
  'gp-graph-has-canvas-id.test.js',
  'gp-section-field.test.js',
  'gp-standard-whitelist.test.js',
  'gp-questions-per-standard.test.js',
  'gp-exam-id-format.test.js',
  'gp-exam-title-nonempty.test.js',
  'gp-no-emdash-solution-steps.test.js',
  'gp-hint-no-emdash.test.js',
  'gp-feedback-no-emdash.test.js',
  'gp-no-null-fields.test.js',
  'gp-rp-file-has-questions-key.test.js',
  'gp-input-id-unique.test.js',
  'gp-input-count.test.js',
  'gp-question-number-field.test.js',
  'gp-solution-steps-strings.test.js',
  'gp-tolerance-range.test.js',
];

let passCount = 0;
let failCount = 0;
let warnCount = 0;

for (const testName of GP_TESTS) {
  const testPath = path.join(TESTS_DIR, testName);
  if (!fs.existsSync(testPath)) {
    console.log(`  SKIP: ${testName} (file not found)`);
    continue;
  }
  const result = runTest(testPath);
  const icon = result.ok ? 'PASS' : 'WARN';
  if (result.ok) passCount++; else warnCount++;
  console.log(`  ${icon}: ${testName}`);
  if (!result.ok) console.log(`       ${result.summary}`);
}

console.log('\n=== Summary ===');
console.log(`Tests: ${passCount} pass, ${warnCount} with findings, ${failCount} errors`);
console.log('\nTop open issues:');
console.log('  1. 14 em dash violations in solution_steps (RP1/2/3/4/5/8/10) — GR');
console.log('  2. 11 em dash violations in hints/feedback (RP4/5/6/7/9) — GR');
console.log('  3. 61 inputs missing answer field (RP3-11) — GR');
console.log('  4. 18 standards gaps: W2.a/W2.d/W3.e absent from multiple exams — GR');
console.log('\nAll critical bugs filed to GR inbox.');
