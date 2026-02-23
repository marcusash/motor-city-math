/**
 * Test for build-qa-summary.cjs
 * Verifies artifacts/qa-summary.json is valid, has all exam IDs, all clean.
 * Run: node tests/property/qa-summary.test.js
 */

'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const script = path.join(ROOT, 'scripts', 'build-qa-summary.cjs');
const outFile = path.join(ROOT, 'artifacts', 'qa-summary.json');

// Run build-qa-summary
const result = spawnSync(process.execPath, [script], {
  encoding: 'utf8',
  cwd: ROOT,
  timeout: 30000,
});

if (result.error || result.status !== 0) {
  console.error('FAIL: build-qa-summary.cjs did not exit 0');
  console.error((result.stdout + result.stderr).substring(0, 300));
  process.exit(1);
}

// Parse output file
let summary;
try {
  summary = JSON.parse(fs.readFileSync(outFile, 'utf8'));
} catch (e) {
  console.error('FAIL: artifacts/qa-summary.json is not valid JSON:', e.message);
  process.exit(1);
}

let pass = 0;
let fail = 0;

// Must have exams array
if (!Array.isArray(summary.exams)) {
  console.error('FAIL: qa-summary.json missing exams array');
  process.exit(1);
}

// Each exam should have an id and per-category missing arrays
const MISSING_FIELDS = ['missing_hint', 'missing_solution_steps', 'missing_feedback', 'missing_inputs', 'missing_standard', 'missing_question_html'];

for (const exam of summary.exams) {
  if (!exam.exam_id) {
    console.error(`FAIL: exam entry missing exam_id`);
    fail++;
    continue;
  }

  let examFail = 0;
  for (const field of MISSING_FIELDS) {
    if (!Array.isArray(exam[field])) {
      console.error(`FAIL: ${exam.exam_id} missing ${field} array`);
      examFail++;
    } else if (exam[field].length > 0) {
      console.error(`FAIL: ${exam.exam_id}.${field} has ${exam[field].length} issue(s)`);
      examFail++;
    }
  }

  if (examFail === 0) {
    console.log(`PASS: ${exam.exam_id} clean (all categories empty)`);
    pass++;
  } else {
    fail += examFail;
  }
}

console.log(`\n${pass} exams clean, ${fail} with issues`);
if (fail > 0) process.exit(1);
