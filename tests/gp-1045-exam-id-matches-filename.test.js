// gp-1045-exam-id-matches-filename.test.js — exam_id number must match file name number

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const fileN = file.match(/retake-practice-(\d+)\.json/)[1];
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const idN = (data.exam_id || '').replace('retake-practice-', '');
  if (fileN === idN) { pass++; }
  else { fail++; failures.push(`${file}: exam_id number "${idN}" doesn't match filename number "${fileN}"`); }
}

console.log(`gp-1045-exam-id-matches-filename: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exam_id numbers match their filenames`);
