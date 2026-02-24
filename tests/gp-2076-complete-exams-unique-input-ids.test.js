// gp-2076-complete-exams-input-ids-unique-within-exam.test.js
// Input IDs must be unique within each exam (no duplicate input IDs).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const seen = new Set();
  let dupFound = false;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (seen.has(inp.id)) { fail++; failures.push(data.exam_id + ' duplicate input id=' + inp.id); dupFound = true; }
      else seen.add(inp.id);
    }
  }
  if (!dupFound) pass++;
}
console.log('gp-2076-unique-input-ids: ' + pass + ' exams pass, ' + fail + ' dups found');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all 12 exams have unique input IDs within exam');
