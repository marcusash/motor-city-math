// gp-1025-input-label-not-empty.test.js — all inputs with a label field must have non-empty label
// Note: radio inputs may intentionally have empty label (question text is in question_html)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (!('label' in inp)) continue; // label is optional
      if (inp.type === 'radio') { continue; } // radio labels intentionally empty (text in question_html)
      if (typeof inp.label === 'string' && inp.label.trim().length > 0) { pass++; }
      else { fail++; failures.push(`${file}: ${q.id} input ${inp.id} (${inp.type}) has empty/invalid label`); }
    }
  }
}

console.log(`gp-1025-input-label-not-empty: ${pass} valid labels, ${fail} invalid (radio skipped)`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} non-radio input labels are non-empty`);
