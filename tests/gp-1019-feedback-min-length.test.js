// gp-1019-feedback-min-length.test.js — feedback_correct and feedback_wrong should be >= 5 chars

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN = 5;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of ['feedback_correct', 'feedback_wrong']) {
      const len = (q[field] || '').length;
      if (len >= MIN) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id} ${field} is only ${len} chars`); }
    }
  }
}

console.log(`gp-1019-feedback-min-length: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} feedback fields have >= ${MIN} chars`);
