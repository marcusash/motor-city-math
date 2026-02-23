// gp-each-exam-input-ids-unique-per-question.test.js — input ids must be unique within each question

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
    const ids = (q.inputs || []).map(i => i.id);
    const seen = new Set();
    for (const id of ids) {
      if (seen.has(id)) {
        fail++;
        failures.push(`${file}: ${q.id} duplicate input id "${id}"`);
      } else { seen.add(id); pass++; }
    }
  }
}

console.log(`gp-each-exam-input-ids-unique-per-question: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} input IDs are unique within their question`);
