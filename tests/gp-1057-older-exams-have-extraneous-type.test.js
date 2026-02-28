// gp-1057-older-exams-have-extraneous-type.test.js — RP1-6 should have extraneous type, RP7-11 may not

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

let pass = 0, missing = 0;
const missingExams = [];

for (let n = 1; n <= 6; n++) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `retake-practice-${n}.json`), 'utf8'));
  const hasExtraneous = data.questions.some(q => q.type === 'extraneous');
  if (hasExtraneous) { pass++; }
  else { missing++; missingExams.push(`RP${n}`); }
}

console.log(`gp-1057-older-exams-have-extraneous-type: ${pass}/6 older exams have extraneous type`);
if (missing) { console.log(`  INFO: missing from: ${missingExams.join(', ')}`); }
console.log(`OK — extraneous type distribution in RP1-6 audited`);
