// gp-1302-no-duplicate-q-ids-cross-exam.test.js
// Question IDs must be globally unique across all 11 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const seen = new Map(); let fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (seen.has(q.id)) { fail++; failures.push(q.id + ' seen in ' + seen.get(q.id) + ' AND ' + file); }
    else seen.set(q.id, file);
  }
}
const pass = seen.size;
console.log('gp-1302-no-dup-ids-cross-exam: ' + pass + ' unique, ' + fail + ' duplicates');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + pass + ' question IDs globally unique across all exams');
