// gp-input-ids-unique-within-exam.test.js — input IDs must be unique within each exam

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
  const seen = new Set();
  let examPass = 0;
  let examFail = 0;
  for (const q of data.questions) {
    for (const input of (q.inputs || [])) {
      if (!input.id) { examFail++; failures.push(`${file}: Q${q.id} input missing id`); continue; }
      if (seen.has(input.id)) {
        examFail++; failures.push(`${file}: duplicate input id="${input.id}" (Q${q.id})`);
      } else {
        seen.add(input.id);
        examPass++;
      }
    }
  }
  pass += examPass;
  fail += examFail;
}

console.log(`gp-input-ids-unique-within-exam: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.slice(0, 5).forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} input IDs are unique within their exam`);
