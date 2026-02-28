/**
 * Property test: every question has a non-empty feedback_correct string.
 * Missing feedback breaks UI after correct answer.
 * Run: node tests/property/exam-feedback-present.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;

let pass = 0;
let fail = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;
  let examFail = 0;

  for (const q of exam.questions || []) {
    const fb = q.feedback_correct;
    if (!fb || typeof fb !== 'string' || fb.trim().length === 0) {
      console.error(`FAIL ${examId} Q${q.number}: feedback_correct is missing or empty`);
      examFail++;
      fail++;
    }
  }

  if (examFail === 0) {
    console.log(`PASS ${examId}: all ${exam.questions.length} questions have feedback_correct`);
    pass++;
  }
}

console.log(`\n${pass} exams passed, ${fail} questions missing feedback`);
if (fail > 0) process.exit(1);
