// gp-each-exam-has-w3-questions.test.js — every exam must have at least 1 W3.x standard question

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
  const w3Count = data.questions.filter(q => q.standard && q.standard.startsWith('W3')).length;
  const w2Count = data.questions.filter(q => q.standard && q.standard.startsWith('W2')).length;
  if (w3Count === 0) {
    fail++;
    failures.push(`${file}: no W3 questions (W2=${w2Count})`);
  } else {
    pass++;
    console.log(`  ${file.replace('retake-practice-','RP').replace('.json','')}: W2=${w2Count}, W3=${w3Count}`);
  }
}

console.log(`gp-each-exam-has-w3-questions: ${pass} pass, ${fail} missing W3`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exams have at least 1 W3 question`);
