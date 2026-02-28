// gp-exam-json-is-valid-utf8.test.js — all exam files must be valid UTF-8 JSON (no BOM, no control chars)

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
  const filePath = path.join(DATA_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  
  // Check for BOM
  if (raw.charCodeAt(0) === 0xFEFF) {
    fail++;
    failures.push(`${file}: starts with BOM (byte order mark)`);
    continue;
  }
  
  // Check for NUL or other dangerous control chars
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(raw)) {
    fail++;
    failures.push(`${file}: contains control characters`);
    continue;
  }
  
  try {
    JSON.parse(raw);
    pass++;
  } catch (e) {
    fail++;
    failures.push(`${file}: JSON parse error: ${e.message}`);
  }
}

console.log(`gp-exam-json-is-valid-utf8: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exam files are valid clean UTF-8 JSON`);
