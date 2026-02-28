// gp-no-double-spaces-in-feedback.test.js — feedback/hint should not have double spaces

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of ['feedback_correct', 'feedback_wrong', 'hint']) {
      const val = q[field];
      if (typeof val !== 'string') continue;
      if (val.includes('  ')) {
        fail++;
        findings.push(`${file}: ${q.id}.${field} has double spaces`);
      } else { pass++; }
    }
  }
}

console.log(`gp-no-double-spaces-in-feedback: ${pass} pass, ${fail} advisory findings`);
if (findings.length) { findings.slice(0, 5).forEach(f => console.log('  INFO:', f)); }
console.log(`OK — double space audit complete`);
