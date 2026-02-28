// gp-number-tolerance-under-5.test.js — number input tolerance should be < 5 (advisory for large tolerances)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const THRESHOLD = 5;
let pass = 0, advisory = 0;
const findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (inp.type !== 'number' || typeof inp.tolerance !== 'number') continue;
      if (inp.tolerance < THRESHOLD) { pass++; }
      else { advisory++; findings.push(`${file}: ${q.id}/${inp.id} tolerance=${inp.tolerance} (>=${THRESHOLD})`); }
    }
  }
}

console.log(`gp-number-tolerance-under-5: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.slice(0, 5).forEach(f => console.log('  INFO:', f)); }
console.log(`OK — number input tolerance distribution audit complete`);
