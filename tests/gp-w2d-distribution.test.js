// gp-w2d-distribution.test.js — W2.d tracking (5 questions, only in RP7-11)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 5;
let total = 0;
const perExam = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.standard === 'W2.d').length;
  total += count;
  if (count > 0) perExam.push(`${file.replace('retake-practice-','RP').replace('.json','')}=${count}`);
}

console.log(`gp-w2d-distribution: W2.d total=${total} (baseline: ${BASELINE})`);
console.log(`  Present in: ${perExam.join(', ') || 'none'}`);
if (total < BASELINE) {
  console.log(`  INFO: W2.d count below baseline ${BASELINE}`);
}
console.log(`OK — W2.d distribution audited`);
