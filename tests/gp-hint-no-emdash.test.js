// gp-hint-no-emdash.test.js — no em dashes in hint fields across all RP exams
// Em dashes (—) violate .agent-protocol.md §em-dash-ban and confuse screen readers

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const EM_DASH = '\u2014';
const EN_DASH = '\u2013';

let pass = 0;
let fail = 0;
const violations = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const questions = data.questions || [];
  for (const q of questions) {
    const hintFields = ['hint', 'hint_2', 'hint_3'];
    for (const field of hintFields) {
      if (!q[field]) continue;
      if (q[field].includes(EM_DASH) || q[field].includes(EN_DASH)) {
        fail++;
        violations.push(`${file} Q${q.id || q.number} .${field}`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-hint-no-emdash: ${pass} pass, ${fail} fail`);
if (violations.length) {
  console.log('VIOLATIONS:');
  violations.forEach(v => console.log('  ', v));
  process.exit(1);
}
console.log('OK — no em dashes in hint fields');
