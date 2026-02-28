// gp-exam-files-parseable-json.test.js — all exam JSON files must parse without errors

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ALL_JSON = fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('.json'))
  .sort();

let pass = 0;
let fail = 0;
const failures = [];

for (const file of ALL_JSON) {
  try {
    const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
    JSON.parse(content);
    pass++;
  } catch (e) {
    fail++;
    failures.push(`${file}: JSON parse error — ${e.message}`);
  }
}

console.log(`gp-exam-files-parseable-json: ${pass} pass, ${fail} fail`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL:', f));
  process.exit(1);
}
console.log(`OK — all ${pass} JSON files in data/ parse without errors`);
