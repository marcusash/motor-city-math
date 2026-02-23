// gp-exam-created-field.test.js — verify each RP file has a created date field in valid ISO 8601 format

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const created = data.created;
  
  if (!created) {
    fail++;
    issues.push(`${file}: missing 'created' field`);
    continue;
  }
  
  const d = new Date(created);
  if (isNaN(d.getTime())) {
    fail++;
    issues.push(`${file}: 'created' is not a valid date: '${created}'`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-created-field: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(fail > 0 ? 1 : 0);
}
console.log(`OK — all ${pass} exams have valid created dates`);
