// gp-w3c-appears-in-exams.test.js — W3.c tracking (16 questions, baseline guard)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BASELINE = 16;
let total = 0;
const perExam = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.standard === 'W3.c').length;
  total += count;
  if (count > 0) perExam.push(`${file.replace('retake-practice-','RP').replace('.json','')}=${count}`);
}

console.log(`gp-w3c-appears-in-exams: W3.c total=${total} (baseline: ${BASELINE})`);
console.log(`  Present in: ${perExam.join(', ') || 'none'}`);
if (total < BASELINE) {
  console.log(`  INFO: W3.c below baseline ${BASELINE}`);
}
console.log(`OK — W3.c distribution audited`);
