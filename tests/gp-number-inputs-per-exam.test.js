// gp-number-inputs-per-exam.test.js — audit number input counts across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let totalNumber = 0;
const perExam = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  let count = 0;
  for (const q of data.questions) {
    count += (q.inputs || []).filter(i => i.type === 'number').length;
  }
  totalNumber += count;
  perExam.push(`${file.replace('retake-practice-','RP').replace('.json','')}=${count}`);
}

const avg = (totalNumber / RP_FILES.length).toFixed(1);
console.log(`gp-number-inputs-per-exam: ${totalNumber} total number inputs across ${RP_FILES.length} exams (avg ${avg})`);
perExam.forEach(e => console.log(`  ${e}`));
console.log(`OK — number input distribution audited (expected ~${Math.round(avg)} per exam)`);
