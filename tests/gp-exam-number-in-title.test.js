// gp-exam-number-in-title.test.js — exam title should contain the exam number or 'Practice'

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const title = data.title || '';
  const num = file.match(/retake-practice-(\d+)\.json/)?.[1];
  
  const hasNumber = title.includes(num);
  const hasPractice = /practice|retake/i.test(title);
  
  if (hasNumber || hasPractice) {
    pass++;
    console.log(`  OK: RP${num} — "${title.substring(0, 50)}"`);
  } else {
    warn++;
    issues.push(`RP${num}: title doesn't mention number or 'Practice': "${title}"`);
  }
}

console.log(`gp-exam-number-in-title: ${pass} pass, ${warn} ambiguous`);
if (issues.length) {
  console.log('WARN — titles should identify the exam clearly:');
  issues.forEach(i => console.log('  ', i));
}
process.exit(0);
