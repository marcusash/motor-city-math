// gp-feedback-correct-no-exclamation-overuse.test.js — avoid excessive exclamation marks in correct feedback

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EXCLAIM_LIMIT = 2;

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = q.feedback_correct || '';
    const count = (fc.match(/!/g) || []).length;
    if (count > EXCLAIM_LIMIT) {
      warn++;
      warnings.push(`${file}: Q${q.id} feedback_correct has ${count} exclamation marks: "${fc.substring(0, 60)}"`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-no-exclamation-overuse: ${pass} pass, ${warn} flagged`);
if (warnings.length) {
  console.log('INFO — excessive exclamation marks (voice guide: calm, coach-style):');
  warnings.forEach(w => console.log('  ', w));
}
console.log(`OK — ${pass} questions have appropriate exclamation usage in correct feedback`);
