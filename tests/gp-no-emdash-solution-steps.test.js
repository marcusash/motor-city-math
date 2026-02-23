// gp-no-emdash-solution-steps.test.js — no em dashes in solution step strings
// Em dashes in solution steps violate the agent protocol em dash ban

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const EM_DASH = '\u2014';
const EN_DASH = '\u2013';

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions || []) {
    const steps = q.solution_steps || [];
    steps.forEach((step, i) => {
      if (typeof step === 'string' && (step.includes(EM_DASH) || step.includes(EN_DASH))) {
        fail++;
        violations.push(`${file} Q${q.id || q.number} step[${i}]: contains em/en dash`);
      } else {
        pass++;
      }
    });
  }
}

console.log(`gp-no-emdash-solution-steps: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — no em/en dashes in solution steps');
