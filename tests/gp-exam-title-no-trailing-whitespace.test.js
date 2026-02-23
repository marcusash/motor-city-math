// gp-exam-title-no-trailing-whitespace.test.js — exam title and subtitle must not have leading/trailing whitespace

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const title = data.title || '';
  const subtitle = data.subtitle || '';
  
  if (title !== title.trim()) {
    fail++;
    failures.push(`${file}: title has leading/trailing whitespace: '${title}'`);
  } else if (subtitle !== subtitle.trim()) {
    fail++;
    failures.push(`${file}: subtitle has leading/trailing whitespace: '${subtitle}'`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-title-no-trailing-whitespace: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have clean title/subtitle`);
