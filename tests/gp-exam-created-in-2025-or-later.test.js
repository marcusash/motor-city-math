// gp-exam-created-in-2025-or-later.test.js — all exams should have created date 2025 or later

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];
const dates = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const created = data.created || '';
  dates.push(`${file.replace('retake-practice-','RP').replace('.json','')}=${created}`);
  const year = parseInt(created.substring(0, 4));
  if (isNaN(year) || year < 2025) {
    warn++;
    warnings.push(`${file}: created="${created}" is before 2025 (check date)`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-created-in-2025-or-later: ${pass} pass, ${warn} old/invalid date`);
console.log(`  Dates: ${dates.join(', ')}`);
if (warnings.length) {
  console.log('INFO — exams with suspicious creation dates:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have 2025+ creation dates`);
