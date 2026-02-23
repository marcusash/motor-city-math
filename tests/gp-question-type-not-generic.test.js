// gp-question-type-not-generic.test.js — question types shouldn't be 'generic', 'other', 'default', or 'test'

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const BANNED_TYPES = new Set(['generic', 'other', 'default', 'test', 'tbd', 'todo', 'unknown', 'misc']);

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (BANNED_TYPES.has((q.type || '').toLowerCase())) {
      fail++;
      failures.push(`${file}: Q${q.id} type='${q.type}' is a banned generic type`);
    } else {
      pass++;
    }
  }
}

console.log(`gp-question-type-not-generic: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} questions have specific non-generic types`);
