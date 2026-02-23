// gp-w3b-coverage-per-exam.test.js — W3.b is the leading standard; track per-exam distribution

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let totalW3b = 0;
let examsWithW3b = 0;

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const count = data.questions.filter(q => q.standard === 'W3.b').length;
  totalW3b += count;
  if (count > 0) examsWithW3b++;
  console.log(`  ${file.replace('retake-practice-','RP').replace('.json','')}: W3.b=${count}`);
}

const BASELINE = 34;
console.log(`gp-w3b-coverage-per-exam: ${totalW3b} total W3.b questions (baseline: ${BASELINE})`);
if (totalW3b !== BASELINE) {
  console.log(`  INFO: W3.b count changed from ${BASELINE} to ${totalW3b}`);
}
console.log(`OK — W3.b distribution audited across ${examsWithW3b} exams`);
