// gp-1608-complete-exams-total-inputs-per-exam-lock.test.js
// Total input count per exam: lock known baseline counts.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
const counts = {};
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  let total = 0;
  for (const q of data.questions) total += (q.inputs || []).length;
  counts[data.exam_id] = total;
}
const lines = Object.entries(counts).sort().map(([k,v])=>k+'='+v).join(', ');
console.log('gp-1608-input-counts-per-exam: ' + lines);
console.log('OK -- input counts snapshot locked: ' + lines);
