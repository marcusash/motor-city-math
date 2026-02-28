// gp-no-trailing-whitespace-in-fields.test.js — detect leading/trailing whitespace in key string fields

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const CHECK_FIELDS = ['hint', 'feedback_correct', 'feedback_wrong', 'standard', 'type', 'section'];

let pass = 0;
let warn = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of CHECK_FIELDS) {
      const val = q[field];
      if (typeof val !== 'string') continue;
      if (val !== val.trim()) {
        warn++;
        issues.push(`${file}: Q${q.id} field '${field}' has leading/trailing whitespace`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-trailing-whitespace: ${pass} pass, ${warn} with whitespace issues`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
}
// Informational only
process.exit(0);
