// gp-solution-steps-max-length.test.js — individual solution steps should not be excessively long (ADHD: digestible chunks)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_STEP_LENGTH = 300; // chars — if a step is longer, it may need to be split

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const steps = q.solution_steps || [];
    steps.forEach((step, i) => {
      if (typeof step !== 'string') return;
      if (step.length > MAX_STEP_LENGTH) {
        warn++;
        issues.push(`${file}: Q${q.id} step[${i}] is ${step.length} chars (>${MAX_STEP_LENGTH}): "${step.substring(0, 60)}..."`);
      } else {
        pass++;
      }
    });
  }
}

console.log(`gp-solution-steps-max-length: ${pass} pass, ${warn} over ${MAX_STEP_LENGTH} chars (informational)`);
if (issues.length) {
  console.log('LONG STEPS (ADHD concern — consider splitting):');
  issues.slice(0, 10).forEach(i => console.log('  ', i));
  if (issues.length > 10) console.log(`  ...and ${issues.length - 10} more`);
}
// Informational only
process.exit(0);
