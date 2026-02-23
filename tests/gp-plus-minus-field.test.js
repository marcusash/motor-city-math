// gp-plus-minus-field.test.js — verify plus_minus field is a valid number when present

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
let skipped = 0;
const issues = [];

for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    const pm = q.plus_minus;
    if (pm === undefined || pm === null) {
      skipped++;
      continue;
    }
    const num = Number(pm);
    if (!isNaN(num) && isFinite(num) && num >= 0) {
      pass++;
    } else {
      fail++;
      issues.push(`${file}: Q${q.id} plus_minus='${pm}' is not a valid non-negative number`);
    }
  }
}

console.log(`gp-plus-minus-field: ${pass} pass, ${fail} fail, ${skipped} without plus_minus`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — all ${pass} plus_minus fields are valid`);
