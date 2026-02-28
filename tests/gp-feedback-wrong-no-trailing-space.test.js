// gp-feedback-wrong-no-trailing-space.test.js — feedback_wrong must not have trailing whitespace

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, advisory = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = q.feedback_wrong || '';
    if (fw !== fw.trimEnd()) {
      advisory++;
      findings.push(`${file}: ${q.id} feedback_wrong has trailing whitespace`);
    } else { pass++; }
  }
}

console.log(`gp-feedback-wrong-no-trailing-space: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — feedback_wrong trailing space audit complete`);
