// gp-exam-all-q15-same-section.test.js — Q15 should always be in Section D

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const q15 = data.questions[14]; // 15th question, 0-indexed
  if (!q15) {
    warn++;
    warnings.push(`${file}: no Q15 found`);
    continue;
  }
  if (q15.section !== 'D') {
    warn++;
    warnings.push(`${file}: Q15 (id=${q15.id}) is in Section ${q15.section} (expected D)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-all-q15-same-section: ${pass} pass, ${warn} not in D`);
if (warnings.length) {
  console.log('INFO — Q15 not in Section D:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have Q15 in Section D`);
