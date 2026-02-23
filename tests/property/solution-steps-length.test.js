/**
 * Property test: solution_steps has >= 3 entries per question.
 * Fewer than 3 steps usually means incomplete solution.
 * Run: node tests/property/solution-steps-length.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;
const MIN_STEPS = 3;

let pass = 0;
let fail = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;
  let examFail = 0;

  for (const q of exam.questions || []) {
    const steps = q.solution_steps || [];
    if (!Array.isArray(steps) || steps.length < MIN_STEPS) {
      console.error(`FAIL ${examId} Q${q.number}: only ${steps.length} solution step(s) (need >= ${MIN_STEPS})`);
      examFail++;
      fail++;
    }
  }

  if (examFail === 0) {
    console.log(`PASS ${examId}: all ${exam.questions.length} questions have >= ${MIN_STEPS} solution steps`);
    pass++;
  }
}

console.log(`\n${pass} exams passed, ${fail} questions with too few steps`);
if (fail > 0) process.exit(1);
