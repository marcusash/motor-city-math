// gp-1048-question-html-unique-per-exam.test.js — question_html should be unique within each exam

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const seen = new Map();
  for (const q of data.questions) {
    const html = (q.question_html || '').trim();
    if (seen.has(html)) {
      fail++;
      failures.push(`${file}: ${q.id} question_html duplicates ${seen.get(html)}`);
    } else {
      seen.set(html, q.id);
      pass++;
    }
  }
}

console.log(`gp-1048-question-html-unique-per-exam: ${pass} unique, ${fail} duplicates`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} question_html values are unique within each exam`);
