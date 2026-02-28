// gp-exam-json-valid-parse.test.js — all exam JSON must parse without errors (re-verification)

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR)
  .filter(f => /^retake-practice-\d+\.json$/.test(f))
  .sort();

let pass = 0;
let fail = 0;
const issues = [];

for (const file of RP_FILES) {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
    JSON.parse(raw);
    pass++;
  } catch (e) {
    fail++;
    issues.push(`${file}: JSON parse error — ${e.message}`);
  }
}

console.log(`gp-exam-json-valid-parse: ${pass} pass, ${fail} fail`);
if (issues.length) {
  issues.forEach(i => console.log('  ', i));
  process.exit(1);
}
console.log(`OK — ${pass} exam JSON files parse successfully`);
