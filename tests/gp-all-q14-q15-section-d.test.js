// gp-all-q14-q15-section-d.test.js — Q14 and Q15 must always be Section D across all exams

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
    const num = String(q.id || '').match(/q(\d+)/i);
    if (!num) continue;
    const qNum = parseInt(num[1], 10);
    if (qNum === 14 || qNum === 15) {
      if (q.section !== 'D') {
        fail++;
        failures.push(`${file}: Q${q.id} (number ${qNum}) is section='${q.section}' (expected 'D')`);
      } else {
        pass++;
      }
    }
  }
}

console.log(`gp-all-q14-q15-section-d: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} Q14/Q15 checks are Section D`);
