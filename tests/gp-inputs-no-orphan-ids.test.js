// gp-inputs-no-orphan-ids.test.js — input IDs should not appear duplicated within the same question

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
    const seen = new Set();
    for (const input of (q.inputs || [])) {
      if (!input.id) continue;
      if (seen.has(input.id)) {
        fail++;
        failures.push(`${file}: Q${q.id} has duplicate input id="${input.id}" within the same question`);
      } else {
        seen.add(input.id);
        pass++;
      }
    }
  }
}

console.log(`gp-inputs-no-orphan-ids: ${pass} pass, ${fail} duplicates`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} inputs have unique IDs within their question`);
