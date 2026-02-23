/**
 * Property test: every question's standard field matches W[23].[a-e].
 * Run: node tests/property/standard-field-valid.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;
const STANDARD_RE = /^W[23]\.[a-e]$/;

let pass = 0;
let fail = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;
  let examFail = 0;

  for (const q of exam.questions || []) {
    if (!q.standard || !STANDARD_RE.test(q.standard)) {
      console.error(`FAIL ${examId} Q${q.number}: invalid standard "${q.standard}" (must match W[23].[a-e])`);
      examFail++;
      fail++;
    }
  }

  if (examFail === 0) {
    console.log(`PASS ${examId}: all ${exam.questions.length} standards valid`);
    pass++;
  }
}

console.log(`\n${pass} exams passed, ${fail} invalid standards found`);
if (fail > 0) process.exit(1);
