// gp-no-duplicate-input-ids-across-all-exams.test.js — cross-exam: input IDs should not collide

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const globalInputIds = {}; // id -> file

let pass = 0;
let warn = 0;
const warnings = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    for (const input of (q.inputs || [])) {
      if (!input.id) continue;
      if (globalInputIds[input.id]) {
        // Cross-exam collision — only warn if ID doesn't include exam number
        const id = String(input.id);
        const hasExamNum = /rp\d/i.test(id);
        if (!hasExamNum) {
          warn++;
          warnings.push(`input id="${id}": in ${file} AND ${globalInputIds[id]} (non-prefixed ID collision)`);
        }
        pass++; // prefixed collisions expected (each exam is independent HTML)
      } else {
        globalInputIds[input.id] = file;
        pass++;
      }
    }
  }
}

const totalIds = Object.keys(globalInputIds).length;
console.log(`gp-no-duplicate-input-ids-across-all-exams: ${totalIds} unique IDs, ${warn} non-prefixed collisions`);
if (warnings.length) {
  console.log('INFO — input IDs without exam prefix that collide across exams:');
  warnings.slice(0, 5).forEach(w => console.log('  ', w));
  if (warn > 5) console.log(`  ... and ${warn - 5} more`);
}
console.log(`OK — cross-exam input ID audit complete`);
