// gp-exam-id-format.test.js — exam_id matches retake-practice-N pattern
// Mismatched exam_id causes dashboard to show wrong exam name

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const expectedId = file.replace('.json', '');
  if (!data.exam_id) {
    fail++;
    violations.push(`${file}: missing exam_id field`);
  } else if (data.exam_id !== expectedId) {
    fail++;
    violations.push(`${file}: exam_id="${data.exam_id}" does not match expected "${expectedId}"`);
  } else if (!/^retake-practice-\d+$/.test(data.exam_id)) {
    fail++;
    violations.push(`${file}: exam_id="${data.exam_id}" does not match pattern retake-practice-N`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-id-format: ${pass}/${pass + fail} pass`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log(`OK — all ${pass} exam_ids match filename and pattern`);
