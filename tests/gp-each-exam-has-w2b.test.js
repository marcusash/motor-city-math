// gp-each-exam-has-w2b.test.js — every exam should have at least 1 W2.b question (Kai's intercept weakness)

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
  const w2bCount = data.questions.filter(q => q.standard === 'W2.b').length;
  if (w2bCount === 0) {
    warn++;
    warnings.push(`${file}: no W2.b questions (intercept weakness — needs coverage)`);
  } else {
    pass++;
    console.log(`  ${file.replace('retake-practice-','RP').replace('.json','')}: ${w2bCount} W2.b questions`);
  }
}

console.log(`gp-each-exam-has-w2b: ${pass} pass, ${warn} missing W2.b`);
if (warnings.length) {
  console.log('INFO — exams without W2.b (Kai intercept weakness):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have W2.b intercept questions`);
