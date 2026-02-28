// gp-1376-no-duplicate-input-ids-within-exam.test.js
// Within a single exam, no two inputs should share the same id.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  const seen = new Set();
  let ok = true;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (seen.has(inp.id)) {
        fail++;
        failures.push(file + ': duplicate input id "' + inp.id + '"');
        ok = false;
      } else seen.add(inp.id);
    }
  }
  if (ok) pass++;
}
console.log('gp-1376-no-dup-input-ids-within-exam: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' exams have unique input ids');
