// gp-1156-no-duplicate-question-ids-across-all-exams.test.js
// Question IDs must be globally unique across all 11 exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const seen = new Map(); let dups = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  for (const q of data.questions) {
    if (seen.has(q.id)) { dups++; console.log('  DUP:', q.id, 'in', file, 'AND', seen.get(q.id)); }
    else seen.set(q.id, file);
  }
}
console.log('gp-1156-no-duplicate-question-ids: ' + seen.size + ' unique IDs, ' + dups + ' duplicates');
if (dups > 0) { process.exit(1); }
console.log('OK -- all ' + seen.size + ' question IDs are globally unique');
