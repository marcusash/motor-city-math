// gp-no-missing-question-fields.test.js — check all required question-level fields exist

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRED_Q_FIELDS = ['id', 'section', 'type', 'question_html', 'hint', 'standard', 'solution_steps', 'feedback_correct', 'feedback_wrong', 'inputs'];

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const missing = REQUIRED_Q_FIELDS.filter(f => q[f] === undefined || q[f] === null);
    if (missing.length > 0) {
      fail++;
      issues.push(`${file}: Q${q.id} missing: ${missing.join(', ')}`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-missing-question-fields: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.slice(0, 10).forEach(i => console.log('  ', i));
  if (issues.length > 10) console.log(`  ... and ${issues.length - 10} more`);
  process.exit(1);
}
console.log(`OK — ${pass} questions have all required fields`);
