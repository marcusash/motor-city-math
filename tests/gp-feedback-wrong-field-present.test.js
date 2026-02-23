// gp-feedback-wrong-field-present.test.js — all questions should have feedback_wrong

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
  for (const q of data.questions) {
    const fw = (q.feedback_wrong || '').trim();
    if (!fw) {
      warn++;
      warnings.push(`${file}: Q${q.id} has no feedback_wrong`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-field-present: ${pass} pass, ${warn} missing`);
if (warnings.length) {
  console.log('INFO — questions without feedback_wrong:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have feedback_wrong`);
