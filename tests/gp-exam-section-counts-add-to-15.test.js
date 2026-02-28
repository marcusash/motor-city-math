// gp-exam-section-counts-add-to-15.test.js — section A+B+C+D question counts must sum to 15

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
  const sections = { A: 0, B: 0, C: 0, D: 0 };
  let unknown = 0;
  
  for (const q of data.questions) {
    if (sections[q.section] !== undefined) {
      sections[q.section]++;
    } else {
      unknown++;
    }
  }
  
  const total = sections.A + sections.B + sections.C + sections.D;
  if (total + unknown !== 15) {
    fail++;
    failures.push(`${file}: A=${sections.A} B=${sections.B} C=${sections.C} D=${sections.D} unknown=${unknown} total=${total+unknown} (expected 15)`);
  } else {
    pass++;
    console.log(`  ${file}: A=${sections.A} B=${sections.B} C=${sections.C} D=${sections.D}`);
  }
}

console.log(`gp-exam-section-counts-add-to-15: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have sections summing to 15`);
