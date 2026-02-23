// gp-1044-exam-id-format-regression.test.js — exam_id must be "retake-practice-N" exactly

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const ID_RE = /^retake-practice-\d+$/;
let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const eid = data.exam_id;
  if (typeof eid === 'string' && ID_RE.test(eid)) { pass++; }
  else { fail++; failures.push(`${file}: exam_id="${eid}" doesn't match retake-practice-N`); }
}

console.log(`gp-1044-exam-id-format-regression: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exam_ids match retake-practice-N format`);
