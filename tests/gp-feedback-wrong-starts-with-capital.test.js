// gp-feedback-wrong-starts-with-capital.test.js — feedback_wrong should start with capital letter

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
    if (/^[A-Z\(]/.test(fw)) {
      pass++;
    } else {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_wrong starts lowercase: "${fw.substring(0, 50)}"`);
    }
  }
}

console.log(`gp-feedback-wrong-starts-with-capital: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — wrong feedback starting lowercase:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — ${pass} questions have capitalized wrong feedback`);
