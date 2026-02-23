// gp-1004-section-a-all-identify.test.js — Section A type distribution (identify or quadratic)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const ALLOWED = new Set(['identify', 'quadratic', 'absolute-value']);
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions.filter(q => q.section === 'A')) {
    if (ALLOWED.has(q.type)) { pass++; }
    else { fail++; failures.push(`${file}: ${q.id} Section A type="${q.type}" (not identify or quadratic)`); }
  }
}

console.log(`gp-1004-section-a-all-identify: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} Section A questions are identify, quadratic, or absolute-value type`);
