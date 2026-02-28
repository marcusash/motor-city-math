// gp-rp6-question-count-stable.test.js — RP6 must always have exactly 15 questions (regression guard)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TARGET = 'retake-practice-6.json';
const BASELINE = 15;

const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, TARGET), 'utf8'));
const count = data.questions.length;

console.log(`gp-rp6-question-count-stable: RP6 has ${count} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  FAIL: RP6 question count changed to ${count}`);
  process.exit(1);
}
console.log(`OK — RP6 question count stable at ${BASELINE}`);
