/**
 * Property test: all exams have exactly 15 questions.
 * Run: node tests/property/exam-question-count.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;
const EXPECTED_QUESTIONS = 15;

let pass = 0;
let fail = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) {
    console.log(`SKIP rp${i}: file not found`);
    continue;
  }

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const count = (exam.questions || []).length;

  if (count === EXPECTED_QUESTIONS) {
    console.log(`PASS rp${i}: ${count} questions`);
    pass++;
  } else {
    console.error(`FAIL rp${i}: expected ${EXPECTED_QUESTIONS} questions, got ${count}`);
    fail++;
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
