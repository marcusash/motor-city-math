/**
 * Property test: no hint is identical to another hint in the same exam.
 * Run: node tests/property/exam-hint-uniqueness.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;

let totalPass = 0;
let totalFail = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;
  const allHints = new Map(); // hint text -> first location
  let examFail = 0;

  for (const q of exam.questions || []) {
    // hint is a single string (not an array) in MCM schema
    const hintVal = q.hint;
    if (hintVal && typeof hintVal === 'string') {
      const key = hintVal.trim();
      if (allHints.has(key)) {
        console.error(`FAIL ${examId} Q${q.number}: hint duplicates ${allHints.get(key)}: "${key.substring(0, 60)}"`);
        examFail++;
        totalFail++;
      } else {
        allHints.set(key, `Q${q.number}`);
      }
    }
  }

  if (examFail === 0) {
    console.log(`PASS ${examId}: all ${allHints.size} hints unique`);
    totalPass++;
  }
}

console.log(`\n${totalPass} exams passed, ${totalFail} hint duplicates found`);
if (totalFail > 0) process.exit(1);
