/**
 * Property test: question numbers are sequential 1..15 with no gaps or duplicates.
 * Run: node tests/property/question-number-sequence.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;
const EXPECTED_COUNT = 15;

let pass = 0;
let fail = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;
  const nums = (exam.questions || []).map(q => q.number).sort((a, b) => a - b);
  let examFail = 0;

  // Check for duplicates
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) {
      console.error(`FAIL ${examId}: duplicate question number ${n}`);
      examFail++;
      fail++;
    }
    seen.add(n);
  }

  // Check sequential 1..15
  for (let j = 1; j <= EXPECTED_COUNT; j++) {
    if (!seen.has(j)) {
      console.error(`FAIL ${examId}: missing question number ${j}`);
      examFail++;
      fail++;
    }
  }

  // Check no extra numbers beyond 15
  for (const n of nums) {
    if (n < 1 || n > EXPECTED_COUNT) {
      console.error(`FAIL ${examId}: question number ${n} out of range 1..${EXPECTED_COUNT}`);
      examFail++;
      fail++;
    }
  }

  if (examFail === 0) {
    console.log(`PASS ${examId}: questions numbered 1..${EXPECTED_COUNT} sequential`);
    pass++;
  }
}

console.log(`\n${pass} exams passed, ${fail} failures`);
if (fail > 0) process.exit(1);
