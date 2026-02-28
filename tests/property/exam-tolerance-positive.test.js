/**
 * Property test: all numeric inputs with a tolerance field have tolerance > 0.
 * Zero or negative tolerance would make grading impossible.
 * Run: node tests/property/exam-tolerance-positive.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;

let pass = 0;
let fail = 0;
let checked = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;

  for (const q of exam.questions || []) {
    for (const inp of q.inputs || []) {
      if (inp.type === 'number' && 'tolerance' in inp) {
        checked++;
        if (typeof inp.tolerance !== 'number' || inp.tolerance <= 0) {
          console.error(`FAIL ${examId} Q${q.number} input "${inp.id}": tolerance=${inp.tolerance} (must be > 0)`);
          fail++;
        }
      }
    }
  }
}

if (fail === 0) {
  console.log(`PASS: all ${checked} numeric tolerances are positive`);
  pass = 1;
}

console.log(`\nChecked: ${checked} tolerances | Failures: ${fail}`);
if (fail > 0) process.exit(1);
