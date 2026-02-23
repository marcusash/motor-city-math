// gp-no-duplicate-question-ids-across-all-exams.test.js — question IDs must be unique across all 11 exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const globalIds = {};
let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (globalIds[q.id]) {
      fail++;
      issues.push(`${file}: Q${q.id} also in ${globalIds[q.id]}`);
    } else {
      globalIds[q.id] = file;
      pass++;
    }
  }
}

console.log(`gp-no-duplicate-question-ids-across-all-exams: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} question IDs are globally unique across all ${RP_FILES.length} exams`);
