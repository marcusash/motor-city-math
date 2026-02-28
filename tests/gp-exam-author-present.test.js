// gp-exam-author-present.test.js — every exam should have an 'author' or 'created_by' field

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
  const hasAuthor = (data.author && data.author.trim()) || (data.created_by && data.created_by.trim());
  if (hasAuthor) {
    pass++;
  } else {
    warn++;
    warnings.push(`${file}: no 'author' or 'created_by' field`);
  }
}

console.log(`gp-exam-author-present: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — exams without author attribution (informational):');
  warnings.forEach(w => console.log('  ', w));
}
// Informational — not a hard fail, but good practice
console.log(`OK — ${pass} exams have author, ${warn} without`);
