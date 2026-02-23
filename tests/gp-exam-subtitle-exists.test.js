// gp-exam-subtitle-exists.test.js — exam subtitle provides quick context for Kai when opening the exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const sub = data.subtitle || '';
  if (!sub.trim()) {
    warn++;
    warnings.push(`${file}: missing subtitle field`);
  } else {
    pass++;
  }
}

console.log(`gp-exam-subtitle-exists: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — exams missing subtitle:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have a subtitle`);
