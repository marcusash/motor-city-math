// gp-no-placeholder-hints.test.js — hint fields should not contain placeholder text

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const PLACEHOLDER = [/\bTODO\b/i, /\bTBD\b/i, /^hint here$/i, /^add hint$/i, /^placeholder$/i];

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const hint = q.hint || '';
    const isBad = PLACEHOLDER.some(p => p.test(hint));
    if (isBad) {
      fail++;
      issues.push(`${file}: Q${q.id} hint='${hint}' looks like placeholder`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-no-placeholder-hints: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} hints contain no placeholder text`);
