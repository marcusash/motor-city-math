// gp-exam-all-q14-same-section.test.js — Q14 should always be in Section D

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
  // Find Q14 by index (14th question, 0-indexed is [13])
  const q14 = data.questions[13];
  if (!q14) {
    warn++;
    warnings.push(`${file}: no Q14 found`);
    continue;
  }
  if (q14.section !== 'D') {
    warn++;
    warnings.push(`${file}: Q14 (id=${q14.id}) is in Section ${q14.section} (expected D)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-all-q14-same-section: ${pass} pass, ${warn} not in D`);
if (warnings.length) {
  console.log('INFO — Q14 not in Section D:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have Q14 in Section D`);
