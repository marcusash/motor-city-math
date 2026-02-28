// gp-exam-title-contains-retake.test.js — exam title should reference retake/practice context

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let warn = 0;
const warnings = [];

const EXPECTED_WORDS = ['retake', 'practice', 'exam', 'test', 'algebra'];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const title = (data.title || '').toLowerCase();
  const hasExpected = EXPECTED_WORDS.some(w => title.includes(w));
  if (!hasExpected) {
    warn++;
    warnings.push(`${file}: title='${data.title}' doesn't contain expected keywords`);
  } else {
    pass++;
    console.log(`  ${file}: "${data.title}"`);
  }
}

console.log(`gp-exam-title-contains-retake: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — titles without expected keywords:');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} exams have descriptive titles`);
