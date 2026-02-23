// gp-question-html-not-empty.test.js — question_html must be non-empty (Kai needs something to read)

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
    const qhtml = (q.question_html || '').trim();
    if (!qhtml) {
      fail++;
      failures.push(`${file}: Q${q.id} has empty or missing question_html`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-html-not-empty: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have non-empty question_html`);
