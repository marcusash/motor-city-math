// gp-question-number-q1-to-q15.test.js — questions must be numbered q1 through q15 in each exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const nums = data.questions.map(q => {
    const match = String(q.id || '').match(/q(\d+)/i);
    return match ? parseInt(match[1], 10) : null;
  }).filter(n => n !== null);
  
  const expected = Array.from({length: 15}, (_, i) => i + 1);
  const sorted = [...nums].sort((a, b) => a - b);
  if (JSON.stringify(sorted) !== JSON.stringify(expected)) {
    fail++;
    failures.push(`${file}: question numbers are ${sorted.join(',')} (expected 1-15)`);
  } else {
    pass++;
  }
}

console.log(`gp-question-number-q1-to-q15: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have questions numbered 1-15`);
