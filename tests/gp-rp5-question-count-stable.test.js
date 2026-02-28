// gp-rp5-question-count-stable.test.js — RP5 regression guard: exactly 15 questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const file = path.join(DATA_DIR, 'retake-practice-5.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const EXPECTED = 15;
const count = data.questions.length;

console.log(`gp-rp5-question-count-stable: RP5 has ${count} questions (expected ${EXPECTED})`);
if (count !== EXPECTED) {
  console.log(`  FAIL: RP5 question count changed from ${EXPECTED} to ${count}`);
  process.exit(1);
}
console.log(`OK — RP5 stable at ${count} questions`);
