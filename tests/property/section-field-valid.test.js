/**
 * Property test: every question's section field is A, B, C, or D.
 * Run: node tests/property/section-field-valid.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;
const VALID_SECTIONS = new Set(['A', 'B', 'C', 'D']);

let pass = 0;
let fail = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;
  let examFail = 0;

  for (const q of exam.questions || []) {
    if (!q.section || !VALID_SECTIONS.has(q.section)) {
      console.error(`FAIL ${examId} Q${q.number}: invalid section "${q.section}" (must be A, B, C, or D)`);
      examFail++;
      fail++;
    }
  }

  if (examFail === 0) {
    console.log(`PASS ${examId}: all ${exam.questions.length} sections valid`);
    pass++;
  }
}

console.log(`\n${pass} exams passed, ${fail} invalid sections found`);
if (fail > 0) process.exit(1);
