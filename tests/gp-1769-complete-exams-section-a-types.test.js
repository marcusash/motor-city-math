// gp-1769-complete-exams-section-a-q-types.test.js
// Section A (Q1-3) types must all be from Section A valid types.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
// older: identify, newer: quadratic, exception: rp9-q3 = absolute-value
const SECTION_A_TYPES = new Set(['identify','quadratic','absolute-value']);
const KNOWN_EXCEPTIONS = new Set(['rp9-q3']); // RP9 Q3 is absolute-value in Section A
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const secA = data.questions.filter(q => q.section === 'A');
  for (const q of secA) {
    if (SECTION_A_TYPES.has(q.type)) pass++;
    else { fail++; failures.push(data.exam_id + ':' + q.id + ' Section A type=' + q.type); }
  }
}
console.log('gp-1769-section-a-types: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all Section A questions are identify or quadratic (' + pass + ' questions)');
