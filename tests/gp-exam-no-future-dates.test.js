// gp-exam-no-future-dates.test.js — exam dates should not be in the future (data integrity)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const today = new Date();
today.setHours(23, 59, 59, 999);

let pass = 0;
let fail = 0;
let skipped = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const dateStr = data.created_at || data.date || data.created;
  
  if (!dateStr) {
    skipped++;
    continue;
  }
  
  const examDate = new Date(dateStr);
  if (isNaN(examDate.getTime())) {
    skipped++;
    continue;
  }
  
  if (examDate > today) {
    fail++;
    issues.push(`${file}: date '${dateStr}' is in the future`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-no-future-dates: ${pass} pass, ${fail} fail, ${skipped} skipped (no date)`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} exams have valid past dates`);
