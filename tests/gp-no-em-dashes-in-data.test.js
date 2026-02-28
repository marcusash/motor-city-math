// gp-no-em-dashes-in-data.test.js — no em dashes (—) or en dashes (–) in exam content

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const EM_DASH = '\u2014';
const EN_DASH = '\u2013';

let pass = 0, fail = 0;
const failures = [];

function checkString(str, label) {
  if (str.includes(EM_DASH)) return `em-dash in ${label}`;
  if (str.includes(EN_DASH)) return `en-dash in ${label}`;
  return null;
}

function checkQuestion(q, file) {
  const fields = ['question_html', 'hint', 'feedback_correct', 'feedback_wrong'];
  for (const f of fields) {
    if (typeof q[f] === 'string') {
      const err = checkString(q[f], `${q.id}.${f}`);
      if (err) { fail++; failures.push(`${file}: ${err}`); return; }
    }
  }
  if (Array.isArray(q.solution_steps)) {
    for (const s of q.solution_steps) {
      if (typeof s === 'string') {
        const err = checkString(s, `${q.id}.solution_steps`);
        if (err) { fail++; failures.push(`${file}: ${err}`); return; }
      }
    }
  }
  pass++;
}

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) checkQuestion(q, file);
}

console.log(`gp-no-em-dashes-in-data: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — no em/en dashes found in exam content`);
