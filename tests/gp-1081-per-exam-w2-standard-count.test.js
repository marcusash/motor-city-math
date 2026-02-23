// gp-1081-per-exam-w2-standard-count.test.js
// Each exam must have at least 2 W2.x standard questions (coverage of Worksheet 2).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN = 2;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const w2count = data.questions.filter(q => q.standard && q.standard.startsWith('W2.')).length;
  if (w2count >= MIN) { pass++; }
  else { fail++; failures.push(`${file}: only ${w2count} W2.x questions (need >= ${MIN})`); }
}

console.log(`gp-1081-per-exam-w2-standard-count: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK -- all ${pass} exams have >= ${MIN} W2.x standard questions`);
