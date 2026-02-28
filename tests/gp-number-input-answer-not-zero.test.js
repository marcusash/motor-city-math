// gp-number-input-answer-not-zero.test.js — flag number inputs with answer=0 as advisory (likely placeholder)

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
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number') continue;
      if (inp.answer === 0) {
        advisory++;
        findings.push(`${file}: ${q.id}/${inp.id} has answer=0 (may be placeholder)`);
      } else { pass++; }
    }
  }
}

console.log(`gp-number-input-answer-not-zero: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — zero-answer audit complete`);
