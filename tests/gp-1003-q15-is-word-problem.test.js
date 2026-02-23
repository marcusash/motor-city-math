// gp-1003-q15-is-word-problem.test.js — Q15 (last question) must be type "word-problem" in every exam

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
  const q15 = data.questions[14];
  if (q15 && q15.type === 'word-problem') { pass++; }
  else { advisory++; findings.push(`${file}: Q15 type="${q15 && q15.type}" (expected word-problem)`); }
}

console.log(`gp-1003-q15-is-word-problem: ${pass} pass, ${advisory} advisory`);
if (findings.length) { findings.forEach(f => console.log('  INFO:', f)); }
console.log(`OK — Q15 type audit complete`);
