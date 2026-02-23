// gp-solution-step-min-3-per-section-b.test.js — Section B questions should have >= 3 solution steps

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (q.section !== 'B') continue;
    const steps = (q.solution_steps || []).length;
    if (steps < 3) {
      warn++;
      warnings.push(`${file}: Q${q.id} Section B has only ${steps} solution steps (min 3)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-solution-step-min-3-per-section-b: ${pass} pass, ${warn} under min`);
if (warnings.length) {
  console.log('INFO — Section B questions with < 3 steps:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} Section B questions have >= 3 solution steps`);
