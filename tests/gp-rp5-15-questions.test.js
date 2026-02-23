// gp-rp5-15-questions.test.js — RP5 must have exactly 15 questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'retake-practice-5.json'), 'utf8'));

const BASELINE = 15;
const count = data.questions.length;
console.log(`gp-rp5-15-questions: ${count} questions (expected ${BASELINE})`);
if (count !== BASELINE) { console.log(`  FAIL: RP5 question count changed`); process.exit(1); }
console.log(`OK — RP5 has exactly ${BASELINE} questions`);
