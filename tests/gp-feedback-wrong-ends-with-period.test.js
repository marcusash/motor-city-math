// gp-feedback-wrong-ends-with-period.test.js — wrong feedback should end with period or exclamation

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
    if (!fw) { pass++; continue; }
    if (/[.!?]$/.test(fw)) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_wrong no terminal punctuation: "${fw.substring(0, 60)}"`);
    }
  }
}

console.log(`gp-feedback-wrong-ends-with-period: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — wrong feedback missing terminal punctuation:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have properly terminated wrong feedback`);
