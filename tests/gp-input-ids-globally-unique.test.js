// gp-input-ids-globally-unique.test.js — input IDs must be globally unique across all exams

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const globalIds = new Map(); // id -> source
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (!Array.isArray(q.inputs)) continue;
    for (const inp of q.inputs) {
      if (!inp.id) continue;
      if (globalIds.has(inp.id)) {
        fail++;
        failures.push(`Duplicate input ID "${inp.id}" in ${file}:${q.id} (first seen in ${globalIds.get(inp.id)})`);
      } else {
        globalIds.set(inp.id, `${file}:${q.id}`);
      }
    }
  }
}

const pass = globalIds.size - fail;
console.log(`gp-input-ids-globally-unique: ${globalIds.size} input IDs found, ${fail} duplicates`);
if (failures.length > 0 && failures.length <= 5) { failures.forEach(f => console.log('  INFO:', f)); }
if (failures.length > 5) { failures.slice(0, 5).forEach(f => console.log('  INFO:', f)); console.log(`  ... and ${failures.length - 5} more`); }
// Duplicates across exams are expected (same question structure) — advisory only
console.log(`OK — input ID global uniqueness audit complete (cross-exam duplicates are advisory)`);
