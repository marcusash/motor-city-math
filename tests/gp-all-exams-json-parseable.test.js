// gp-all-exams-json-parseable.test.js — comprehensive parse test: every exam must parse and have top-level structure

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

const REQUIRED_TOP_LEVEL = ['exam_id', 'title', 'version', 'questions'];

let pass = 0;
let fail = 0;
const failures = [];

for (const file of RP_FILES) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    const missing = REQUIRED_TOP_LEVEL.filter(k => data[k] === undefined);
    if (missing.length > 0) {
      fail++;
      failures.push(`${file}: missing required fields: ${missing.join(', ')}`);
    } else {
      pass++;
    }
  } catch (e) {
    fail++;
    failures.push(`${file}: JSON parse error: ${e.message}`);
  }
}

console.log(`gp-all-exams-json-parseable: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} exams parse successfully with required fields`);
