// gp-1819-complete-exams-no-duplicate-question-ids.test.js
// Question IDs must be unique across the entire corpus.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const seenIds = new Map(); let fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    if (seenIds.has(q.id)) { fail++; failures.push(q.id + ' duplicated in ' + file + ' and ' + seenIds.get(q.id)); }
    else seenIds.set(q.id, file);
  }
}
console.log('gp-1819-unique-question-ids:', seenIds.size, 'unique IDs,' , fail, 'duplicates');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all ' + seenIds.size + ' question IDs are globally unique');
