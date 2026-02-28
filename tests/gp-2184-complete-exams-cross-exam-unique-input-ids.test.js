// gp-2184-complete-exams-intra-exam-input-id-uniqueness.test.js
// Input IDs are intentionally reused across exams (e.g., q1_x1 in every exam is by design).
// This test verifies intra-exam uniqueness: within each exam, each question's inputs have unique IDs.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, fail = 0; const failures = [];
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  // Collect all input IDs within this exam
  const examIds = [];
  let examFail = false;
  for (const q of data.questions) {
    for (const inp of (q.inputs||[])) {
      if (examIds.includes(inp.id)) { examFail = true; failures.push(data.exam_id + ' Q' + q.number + ' dup: ' + inp.id); }
      else examIds.push(inp.id);
    }
  }
  if (!examFail) pass++;
  else fail++;
}
console.log('gp-2184-intra-exam-input-uniqueness: ' + pass + ' pass, ' + fail + ' fail');
if (fail > 0) { failures.forEach(f => console.log('  FAIL:', f)); process.exit(1); }
console.log('OK -- All input IDs unique within each exam (cross-exam reuse is by design)');
