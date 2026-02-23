// gp-each-exam-has-both-standards.test.js — every exam must have both W2 and W3 questions

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
  const hasW2 = data.questions.some(q => q.standard && q.standard.startsWith('W2'));
  const hasW3 = data.questions.some(q => q.standard && q.standard.startsWith('W3'));
  
  if (!hasW2) { fail++; failures.push(`${file}: no W2 standard questions`); }
  if (!hasW3) { fail++; failures.push(`${file}: no W3 standard questions`); }
  if (hasW2 && hasW3) pass++;
}

console.log(`gp-each-exam-has-both-standards: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have both W2 and W3 standard questions`);
