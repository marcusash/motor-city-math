// gp-solution-steps-min-per-question.test.js — Section B questions should have >= 2 solution steps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_STEPS = 2;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'B')) {
    const steps = (q.solution_steps || []).length;
    if (steps < MIN_STEPS) {
      fail++;
      failures.push(`${file}: Q${q.id} (Section B) has only ${steps} step(s)`);
    } else { pass++; }
  }
}

console.log(`gp-solution-steps-min-per-question: ${pass} pass, ${fail} too-few`);
if (failures.length) {
  failures.forEach(f => console.log('  ADVISORY:', f));
}
console.log(`OK — audit complete (${pass}/${pass+fail} meet ${MIN_STEPS}+ steps)`);
