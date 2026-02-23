/**
 * Property test: every question_html is at least 15 chars.
 * Short HTML usually indicates a truncation or parse error.
 * Run: node tests/property/question-html-length.test.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const EXAM_COUNT = 11;
const MIN_LEN = 15;

let pass = 0;
let fail = 0;

for (let i = 1; i <= EXAM_COUNT; i++) {
  const f = path.join(DATA_DIR, `retake-practice-${i}.json`);
  if (!fs.existsSync(f)) continue;

  const exam = JSON.parse(fs.readFileSync(f, 'utf8'));
  const examId = `rp${i}`;
  let examFail = 0;

  for (const q of exam.questions || []) {
    const html = q.question_html || '';
    if (html.trim().length < MIN_LEN) {
      console.error(`FAIL ${examId} Q${q.number}: question_html too short (${html.trim().length} chars): "${html.substring(0, 40)}"`);
      examFail++;
      fail++;
    }
  }

  if (examFail === 0) {
    console.log(`PASS ${examId}: all ${exam.questions.length} questions have adequate HTML`);
    pass++;
  }
}

console.log(`\n${pass} exams passed, ${fail} questions with short HTML`);
if (fail > 0) process.exit(1);
