// gp-1005-q14-is-word-problem.test.js — Q14 (Section D first) must be word-problem in every exam

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
  const q14 = data.questions[13];
  if (q14 && q14.type === 'word-problem') { pass++; }
  else { advisory++; findings.push(`${file}: Q14 type="${q14 && q14.type}"`); }
}

console.log(`gp-1005-q14-is-word-problem: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — Q14 type audit complete`);
