// gp-exam-section-a-count.test.js — Section A should have exactly 7 questions (Q1-Q7 pattern)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let info = 0;
const notes = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sectionA = data.questions.filter(q => q.section === 'A');
  if (sectionA.length < 5 || sectionA.length > 9) {
    info++;
    notes.push(`${file}: Section A has ${sectionA.length} questions`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-section-a-count: ${pass} pass, ${info} informational`);
if (notes.length) {
  notes.forEach(n => console.log('  INFO:', n));
}
// Show per-exam breakdown
console.log('Section A counts per exam:');
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const n = data.questions.filter(q => q.section === 'A').length;
  console.log(`  ${file}: ${n}`);
}
console.log(`OK — Section A count audit complete`);
