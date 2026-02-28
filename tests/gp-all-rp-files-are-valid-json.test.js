// gp-all-rp-files-are-valid-json.test.js — all retake-practice-*.json files must parse successfully

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
    failures.push(`${file}: JSON parse error — ${e.message}`);
  }
}

console.log(`gp-all-rp-files-are-valid-json: ${pass} valid, ${fail} invalid`);
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log(`OK — all ${pass} retake practice JSON files are valid`);
