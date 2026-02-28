// gp-rp1-question-count-stable.test.js — RP1 must always have exactly 15 questions (regression guard)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TARGET = 'retake-practice-1.json';
const BASELINE = 15;

const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, TARGET), 'utf8'));
const count = data.questions.length;

console.log(`gp-rp1-question-count-stable: RP1 has ${count} questions (baseline: ${BASELINE})`);
if (count !== BASELINE) {
  console.log(`  FAIL: RP1 question count changed from ${BASELINE} to ${count}`);
  process.exit(1);
}
console.log(`OK — RP1 question count stable at ${BASELINE}`);
