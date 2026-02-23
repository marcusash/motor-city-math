// gp-question-id-format.test.js — all question IDs must match rp{N}-q{N} pattern

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const ID_RE = /^rp\d+-q\d+$/;

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (ID_RE.test(q.id)) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q'${q.id}' does not match rp{N}-q{N} format`);
    }
  }
}

console.log(`gp-question-id-format: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} question IDs match rp{N}-q{N} format`);
