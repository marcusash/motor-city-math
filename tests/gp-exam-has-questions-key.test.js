// gp-exam-has-questions-key.test.js — every exam JSON must have a top-level 'questions' array

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const data = JSON.parse(raw);
  
  if (Array.isArray(data.questions) && data.questions.length > 0) {
    pass++;
  } else {
    fail++;
    issues.push(`${file}: 'questions' is ${Array.isArray(data.questions) ? 'empty' : 'missing'}`);
  }
}

console.log(`gp-exam-has-questions-key: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have a non-empty 'questions' array`);
