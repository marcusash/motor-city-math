// gp-feedback-wrong-min-length.test.js — feedback_wrong should have at least 5 chars of content

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
    const fw = String(q.feedback_wrong || '').trim();
    if (fw.length < MIN_LEN) {
      fail++;
      issues.push(`${file}: Q${q.id} feedback_wrong too short (${fw.length} chars): '${fw}'`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-feedback-wrong-min-length: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} questions have feedback_wrong with ${MIN_LEN}+ chars`);
