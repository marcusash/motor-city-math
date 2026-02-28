// gp-each-exam-has-w3b.test.js — every exam should have at least 1 W3.b question (exponential models)

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
  const count = data.questions.filter(q => q.standard === 'W3.b').length;
  if (count === 0) {
    warn++;
    warnings.push(`${file}: no W3.b questions (exponential models)`);
  } else {
    pass++;
  }
}

console.log(`gp-each-exam-has-w3b: ${pass} pass, ${warn} missing W3.b`);
if (warnings.length) {
  console.log('INFO — exams without W3.b:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have W3.b exponential model questions`);
