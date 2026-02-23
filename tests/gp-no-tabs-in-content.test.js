// gp-no-tabs-in-content.test.js — text fields should not contain raw tab characters (use spaces)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const FIELDS = ['question_html', 'hint', 'feedback_correct', 'feedback_wrong'];

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of FIELDS) {
      const text = q[field] || '';
      if (text.includes('\t')) {
        fail++;
        issues.push(`${file}: Q${q.id} '${field}' contains tab character`);
      } else {
        pass++;
      }
    }
    for (const step of (q.solution_steps || [])) {
      const text = typeof step === 'string' ? step : (step.text || '');
      if (text.includes('\t')) {
        fail++;
        issues.push(`${file}: Q${q.id} solution_step contains tab character`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-tabs-in-content: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} text fields are tab-free`);
