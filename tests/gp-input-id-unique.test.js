// gp-input-id-unique.test.js — input IDs are unique within each exam
// Duplicate input IDs cause grading to overwrite answers

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  const seenIds = new Set();
  let examPass = true;
  for (const q of questions) {
    const inputs = q.inputs || [];
    for (const inp of inputs) {
      if (!inp.id) {
        fail++;
        violations.push(`${file} Q${q.id || q.number}: input missing id field`);
        examPass = false;
      } else if (seenIds.has(inp.id)) {
        fail++;
        violations.push(`${file}: duplicate input id "${inp.id}" in Q${q.id || q.number}`);
        examPass = false;
      } else {
        seenIds.add(inp.id);
      }
    }
  }
  if (examPass) pass++;
}

console.log(`gp-input-id-unique: ${pass}/${pass + fail} exams pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all input IDs are unique within each exam');
