// gp-feedback-correct-min-length.test.js — feedback_correct should be at least 5 characters

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const MIN_LEN = 5;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const fc = String(q.feedback_correct || '').trim();
    if (fc.length < MIN_LEN) {
      fail++;
      issues.push(`${file}: Q${q.id} feedback_correct too short (${fc.length} chars): '${fc}'`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-correct-min-length: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} questions have feedback_correct with ${MIN_LEN}+ chars`);
