// gp-feedback-correct-not-same-as-wrong.test.js — feedback_correct and feedback_wrong must differ

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').trim().toLowerCase();
    const fw = (q.feedback_wrong || '').trim().toLowerCase();
    if (fc && fw && fc === fw) {
      fail++;
      issues.push(`${file}: Q${q.id} feedback_correct === feedback_wrong`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-not-same-as-wrong: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} questions have distinct correct/wrong feedback`);
