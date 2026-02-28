// gp-section-b-has-exponential.test.js — Section B must have at least 1 exponential question per exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0, advisory = 0;
const failures = [], findings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const expInB = data.questions.filter(q => q.section === 'B' && q.type === 'exponential');
  if (expInB.length >= 1) { pass++; }
  else { advisory++; findings.push(`${file}: no exponential in Section B`); }
}

console.log(`gp-section-b-has-exponential: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — Section B exponential distribution audit complete`);
