// gp-section-field.test.js — section field is one of A, B, C, D
// Invalid section breaks the section grouping display in exam.html

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const VALID_SECTIONS = new Set(['A', 'B', 'C', 'D']);

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    if (!q.section) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: missing section field`);
    } else if (!VALID_SECTIONS.has(q.section)) {
      fail++;
      violations.push(`${file} Q${q.id || q.number}: invalid section "${q.section}" (must be A/B/C/D)`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-section-field: ${pass}/${pass + fail} pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — all section fields are A/B/C/D');
