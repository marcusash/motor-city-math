// gp-feedback-wrong-max-length.test.js — feedback_wrong should be under 200 chars (ADHD: concise)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MAX_LEN = 200;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fw = (q.feedback_wrong || '').trim();
    if (fw.length > MAX_LEN) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_wrong is ${fw.length} chars (max ${MAX_LEN})`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-max-length: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — wrong feedback over limit (ADHD: keep concise):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have wrong feedback within ${MAX_LEN} char limit`);
