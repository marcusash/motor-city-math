// gp-2055-complete-exams-number-inputs-total-294.test.js
// Total number-type inputs across all 12 complete exams must equal 294.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions)
    total += (q.inputs || []).filter(i => i.type === 'number').length;
}
console.log('gp-2055-number-inputs: ' + total);
if (total !== 294) { console.log('FAIL: expected 294, got ' + total); process.exit(1); }
console.log('OK -- total number inputs across 12 exams = 294');
