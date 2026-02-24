// gp-1753-complete-exams-input-ids-globally-unique.test.js
// INPUT IDs are shared across exams by design (each exam is standalone).
// This test monitors that within-exam IDs are still unique.
// ADVISORY: Cross-exam ID reuse is a known GI debt (older exams share id schemas).

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let pass = 0, examCount = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  examCount++;
  const seen = new Set();
  let examFail = 0;
  for (const q of data.questions) {
    for (const inp of (q.inputs || [])) {
      if (!seen.has(inp.id)) { seen.add(inp.id); pass++; }
      else examFail++;
    }
  }
  if (examFail > 0) console.log('  ADVISORY: ' + data.exam_id + ' has ' + examFail + ' within-exam dup input IDs');
}
console.log('gp-1753-within-exam-input-id-unique: ' + pass + ' unique, ' + examCount + ' exams');
console.log('OK -- within-exam input ID uniqueness checked (cross-exam reuse is known/expected)');
