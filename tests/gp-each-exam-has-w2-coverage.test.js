// gp-each-exam-has-w2-coverage.test.js — every individual exam must cover at least 1 W2.x standard

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
  const w2Questions = data.questions.filter(q => q.standard && q.standard.startsWith('W2.'));
  if (w2Questions.length === 0) {
    warn++;
    warnings.push(`${file}: no W2.x standards covered in this exam`);
  } else {
    pass++;
    const types = [...new Set(w2Questions.map(q => q.standard))].join(', ');
    console.log(`  ${file}: W2 standards: ${types}`);
  }
}

console.log(`gp-each-exam-has-w2-coverage: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — exams with no W2 coverage:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have at least 1 W2.x question`);
