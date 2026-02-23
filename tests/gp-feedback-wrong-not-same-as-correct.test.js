// gp-feedback-wrong-not-same-as-correct.test.js — feedback_wrong must differ from feedback_correct

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = (q.feedback_correct || '').trim();
    const fw = (q.feedback_wrong || '').trim();
    if (fc && fw && fc === fw) {
      fail++;
      failures.push(`${file}: Q${q.id} feedback_correct and feedback_wrong are identical`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-not-same-as-correct: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have distinct correct/wrong feedback`);
