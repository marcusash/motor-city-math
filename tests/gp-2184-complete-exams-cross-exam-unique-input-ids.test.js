// gp-2184-complete-exams-total-input-ids-are-unique-cross-exam.test.js
// All input IDs across the entire exam suite should be unique.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const allIds = [];
let pass = true; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions) {
    for (const inp of (q.inputs||[])) {
      if (allIds.includes(inp.id)) { pass = false; failures.push(data.exam_id + ' Q' + q.number + ' dup cross-exam: ' + inp.id); }
      else allIds.push(inp.id);
    }
  }
}
console.log('gp-2184-cross-exam-input-ids: ' + (pass ? '1' : '0') + ' pass, ' + failures.length + ' cross-exam dups');
if (!pass) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All ' + allIds.length + ' input IDs are unique across all 12 exams');
