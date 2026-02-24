// gp-1989-complete-exams-hints-absent-lock.test.js
// Hints absent from all 180 questions (schema gap, not yet populated).
// This test FAILS if hints are added -- signal to update other hint tests.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let totalHints = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) totalHints += (q.hints||[]).length;
}
console.log('gp-1989-total-hints:', totalHints);
if (totalHints !== 0) { console.log('SCHEMA CHANGE: hints now populated ('+totalHints+') -- update hint tests'); process.exit(1); }
console.log('OK -- hints still absent from all questions (0 hints, schema gap as expected)');
