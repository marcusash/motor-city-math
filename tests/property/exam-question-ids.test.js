/**
 * Property test: all question IDs unique across all exams.
 * Run: node tests/property/exam-question-ids.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;

const seen = new Map(); // id -> first seen location
let pass = 0;
let fail = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;

  for (const q of exam.questions || []) {
    // Check question-level id if present
    if (q.id) {
      const key = q.id;
      if (seen.has(key)) {
        console.error(`FAIL ${examId} Q${q.number}: id "${key}" already seen in ${seen.get(key)}`);
        fail++;
      } else {
        seen.set(key, `${examId} Q${q.number}`);
      }
    }

    // Check input IDs within the exam — input IDs are exam-scoped
    for (const inp of q.inputs || []) {
      if (inp.id) {
        const key = `${examId}::${inp.id}`;
        if (seen.has(key)) {
          console.error(`FAIL ${examId} Q${q.number}: input id "${inp.id}" already seen at ${seen.get(key)}`);
          fail++;
        } else {
          seen.set(key, `${examId} Q${q.number}`);
        }
      }
    }
  }
}

if (fail === 0) {
  console.log(`PASS: all question and input IDs unique within their exam scope`);
  console.log(`Checked ${seen.size} IDs across all exams`);
  pass++;
}

console.log(`\n${pass} checks passed, ${fail} failures`);
if (fail > 0) process.exit(1);
