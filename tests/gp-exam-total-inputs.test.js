// gp-exam-total-inputs.test.js — count total inputs per exam (useful for grading coverage)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_INPUTS = 20;
const MAX_INPUTS = 50;

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const total = data.questions.reduce((sum, q) => sum + (q.inputs || []).length, 0);
  const label = file.replace('retake-practice-', 'RP').replace('.json', '');
  
  console.log(`  ${label}: ${total} inputs`);
  
  if (total < MIN_INPUTS || total > MAX_INPUTS) {
    warn++;
    issues.push(`${file}: ${total} inputs (expected ${MIN_INPUTS}-${MAX_INPUTS})`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-total-inputs: ${pass} pass, ${warn} out-of-range`);
if (issues.length) {
  console.log('WARN — input count anomalies (informational):');
  issues.forEach(i => console.log('  ', i));
}
process.exit(0);
