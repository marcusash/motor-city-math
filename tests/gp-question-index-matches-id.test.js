// gp-question-index-matches-id.test.js — all 165 questions: index+1 must match question number in ID

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
  const n = data.exam_id.replace('retake-practice-', '');
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    const expectedId = `rp${n}-q${i + 1}`;
    if (q.id === expectedId) { pass++; }
    else { fail++; failures.push(`${file}: index ${i}: expected "${expectedId}" got "${q.id}"`); }
  }
}

console.log(`gp-question-index-matches-id: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have IDs matching their index`);
