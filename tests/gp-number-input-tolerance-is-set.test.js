// gp-number-input-tolerance-is-set.test.js — number inputs should have tolerance set (advisory if missing)

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
      if (typeof inp.tolerance === 'number') { pass++; }
      else { advisory++; findings.push(`${file}: ${q.id}/${inp.id} has no tolerance field`); }
    }
  }
}

console.log(`gp-number-input-tolerance-is-set: ${pass} pass, ${advisory} advisory`);
if (findings.length > 0) { findings.slice(0, 5).forEach(f => console.log('  INFO:', f)); }
console.log(`OK — number input tolerance audit complete`);
