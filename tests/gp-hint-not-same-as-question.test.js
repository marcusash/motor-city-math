// gp-hint-not-same-as-question.test.js — hint should not be a copy of the question text

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

function normalize(str) {
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = normalize(q.hint || '');
    const qhtml = normalize(q.question_html || '');
    if (hint.length > 20 && qhtml.length > 20 && hint === qhtml) {
      fail++;
      issues.push(`${file}: Q${q.id} hint is identical to question text`);
    } else if (hint.length > 30 && qhtml.includes(hint)) {
      fail++;
      issues.push(`${file}: Q${q.id} hint is a substring of question text`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-hint-not-same-as-question: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} hints are distinct from question text`);
