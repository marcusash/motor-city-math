// gp-exam-total-input-count-per-exam.test.js — report total inputs per exam for audit

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

const typeCounts = { dropdown: 0, number: 0, radio: 0, text: 0 };
let grandTotal = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let examTotal = 0;
  const examTypeCounts = { dropdown: 0, number: 0, radio: 0, text: 0 };
  
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      examTotal++;
      grandTotal++;
      if (examTypeCounts[inp.type] !== undefined) examTypeCounts[inp.type]++;
      if (typeCounts[inp.type] !== undefined) typeCounts[inp.type]++;
    }
  }
  
  pass++;
  console.log(`  ${file}: ${examTotal} inputs [d=${examTypeCounts.dropdown} n=${examTypeCounts.number} r=${examTypeCounts.radio} t=${examTypeCounts.text}]`);
}

console.log(`gp-exam-total-input-count-per-exam: ${pass} exams audited`);
console.log(`  Grand total: ${grandTotal} inputs [dropdown=${typeCounts.dropdown} number=${typeCounts.number} radio=${typeCounts.radio} text=${typeCounts.text}]`);
console.log(`OK — input type distribution audit complete`);
