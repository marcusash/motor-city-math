// gp-input-has-label.test.js — every input should have a label field (advisory if missing)

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
      if (typeof inp.label === 'string' && inp.label.trim().length > 0) { pass++; }
      else { advisory++; findings.push(`${file}: ${q.id}/${inp.id} missing label`); }
    }
  }
}

console.log(`gp-input-has-label: ${pass} pass, ${advisory} advisory`);
if (findings.length > 0) { findings.slice(0,5).forEach(f => console.log('  INFO:', f)); }
console.log(`OK — label audit complete`);
