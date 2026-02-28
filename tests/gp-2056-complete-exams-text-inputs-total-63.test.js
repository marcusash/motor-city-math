// gp-2056-complete-exams-text-inputs-total-63.test.js
// Total text-type inputs across all 12 complete exams must equal 63.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  for (const q of data.questions)
    total += (q.inputs || []).filter(i => i.type === 'text').length;
}
console.log('gp-2056-text-inputs: ' + total);
if (total !== 63) { console.log('FAIL: expected 63, got ' + total); process.exit(1); }
console.log('OK -- total text inputs across 12 exams = 63');
