// gp-all-exams-parseable-json.test.js — all 11 exam JSONs must parse without errors

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
  try {
    const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
    JSON.parse(content);
    pass++;
  } catch (err) {
    fail++;
    failures.push(`${file}: JSON parse error — ${err.message}`);
  }
}

console.log(`gp-all-exams-parseable-json: ${pass} pass, ${fail} parse error`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exam JSON files parse without errors`);
