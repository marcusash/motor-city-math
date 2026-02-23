// gp-rp9-question-count-stable.test.js — RP9 regression guard: exactly 15 questions

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const file = path.join(DATA_DIR, 'retake-practice-9.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const EXPECTED = 15;
const count = data.questions.length;

console.log(`gp-rp9-question-count-stable: RP9 has ${count} questions (expected ${EXPECTED})`);
if (count !== EXPECTED) {
  console.log(`  FAIL: RP9 question count changed from ${EXPECTED} to ${count}`);
  process.exit(1);
}
console.log(`OK — RP9 stable at ${count} questions`);
