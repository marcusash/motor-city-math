// gp-exam-json-parseable.test.js — all exam JSON files must parse without errors

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0, fail = 0;
const failures = [];

for (const file of RP_FILES) {
  try {
    JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    pass++;
  } catch (e) {
    fail++;
    failures.push(`${file}: JSON parse error: ${e.message}`);
  }
}

console.log(`gp-exam-json-parseable: ${pass} pass, ${fail} fail`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} exam files are valid JSON`);
