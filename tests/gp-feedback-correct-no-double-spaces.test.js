// gp-feedback-correct-no-double-spaces.test.js — feedback_correct must not contain double spaces

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = q.feedback_correct || '';
    if (fc.includes('  ')) {
      fail++;
      failures.push(`${file}: ${q.id} feedback_correct has double space`);
    } else { pass++; }
  }
}

console.log(`gp-feedback-correct-no-double-spaces: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} feedback_correct values have no double spaces`);
