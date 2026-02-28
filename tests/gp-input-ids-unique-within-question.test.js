// gp-input-ids-unique-within-question.test.js — input IDs must be unique within each question

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
  for (const q of data.questions) {
    if (!Array.isArray(q.inputs) || q.inputs.length === 0) continue;
    const ids = q.inputs.map(i => i.id).filter(Boolean);
    const seen = new Set();
    const dupes = [];
    for (const id of ids) {
      if (seen.has(id)) dupes.push(id);
      seen.add(id);
    }
    if (dupes.length > 0) {
      fail++;
      failures.push(`${file}: ${q.id} duplicate input IDs: ${dupes.join(', ')}`);
    } else { pass++; }
  }
}

console.log(`gp-input-ids-unique-within-question: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} questions have unique input IDs`);
