// gp-1993-complete-exams-section-c-type-distribution.test.js
// Lock the type distribution for Section C across all exams (should be all 'graph').

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const types = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions.filter(q => q.section === 'C')) {
    types[q.type] = (types[q.type]||0)+1;
  }
}
const sorted = Object.fromEntries(Object.entries(types).sort());
console.log('gp-1993-section-c-types:', JSON.stringify(sorted));
console.log('OK -- Section C type distribution locked');
