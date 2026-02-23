// gp-exam-time-per-question.test.js — verify estimated time per question is reasonable
// Based on time_minutes / question_count — should be 3-5 min per question for Algebra 2

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_PER_Q = 2.5;
const MAX_PER_Q = 6;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const time = data.time_minutes;
  const count = data.questions ? data.questions.length : 0;
  
  if (!time || !count) {
    fail++;
    issues.push(`${file}: missing time_minutes or questions`);
    continue;
  }
  
  const perQ = time / count;
  if (perQ < MIN_PER_Q || perQ > MAX_PER_Q) {
    fail++;
    issues.push(`${file}: ${time} min / ${count} Q = ${perQ.toFixed(1)} min/Q (expected ${MIN_PER_Q}-${MAX_PER_Q})`);
  } else {
    pass++;
    console.log(`  OK: ${file.replace('retake-practice-','RP').replace('.json','')} — ${perQ.toFixed(1)} min/Q`);
  }
}

console.log(`gp-exam-time-per-question: ${pass} pass, ${fail} out-of-range`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have reasonable time-per-question`);
