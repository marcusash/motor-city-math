// gp-1594-complete-exams-no-duplicate-input-ids-across-exam.test.js
// Input IDs across ALL questions in one exam must be globally unique.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  const allIds = [];
  for (const q of data.questions) for (const inp of (q.inputs || [])) allIds.push(inp.id);
  const unique = new Set(allIds).size;
  if (unique === allIds.length) pass++;
  else { fail++; failures.push(data.exam_id + ': ' + allIds.length + ' inputs, ' + unique + ' unique'); }
}
console.log('gp-1594-exam-wide-input-ids-unique: ' + pass + ' pass, ' + fail + ' fail');
if (failures.length) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- all input IDs globally unique within each exam (' + pass + ' exams checked)');
