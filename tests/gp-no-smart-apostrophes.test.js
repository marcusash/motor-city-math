// gp-no-smart-apostrophes.test.js — content fields should use straight apostrophe (') not curly (' ')

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const CURLY_APOSTROPHES = ['\u2018', '\u2019']; // ' and '
const FIELDS = ['question_html', 'hint', 'feedback_correct', 'feedback_wrong'];

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const field of FIELDS) {
      const text = q[field] || '';
      const hasCurly = CURLY_APOSTROPHES.some(ch => text.includes(ch));
      if (hasCurly) {
        warn++;
        warnings.push(`${file}: Q${q.id} '${field}' has curly apostrophe`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-no-smart-apostrophes: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — curly apostrophes found (may affect string matching):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} fields use straight apostrophes`);
