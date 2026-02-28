/**
 * Property test: no two inputs in the same question share the same ID.
 * Duplicate input IDs cause grading failures when GA reads answers.
 * Run: node tests/property/duplicate-input-ids.test.js
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
    const inputIds = new Set();
    for (const inp of q.inputs || []) {
      if (!inp.id) continue;
      if (inputIds.has(inp.id)) {
        console.error(`FAIL ${examId} Q${q.number}: duplicate input id "${inp.id}" within same question`);
        examFail++;
        fail++;
      } else {
        inputIds.add(inp.id);
      }
    }
  }

  if (examFail === 0) {
    console.log(`PASS ${examId}: all input IDs unique within each question`);
    pass++;
  }
}

console.log(`\n${pass} exams passed, ${fail} duplicate input IDs found`);
if (fail > 0) process.exit(1);
