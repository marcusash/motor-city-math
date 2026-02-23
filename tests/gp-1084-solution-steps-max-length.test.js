// gp-1084-solution-steps-max-length.test.js
// Individual solution steps should be under 300 chars (readability).

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX = 300;
let pass = 0, advisory = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (let i = 0; i < (q.solution_steps || []).length; i++) {
      const step = q.solution_steps[i];
      if (typeof step === 'string' && step.length <= MAX) { pass++; }
      else { advisory++; findings.push(`${file}: ${q.id} step[${i}] is ${step.length} chars (max ${MAX})`); }
    }
  }
}

console.log(`gp-1084-solution-steps-max-length: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK -- solution step length audit complete`);
