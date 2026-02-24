// gp-1982-complete-exams-total-hints-snapshot.test.js
// Document total hint count across all 12 complete exams.

const fs = require('fs'), path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');
const RP_FILES = fs.readdirSync(DATA_DIR).filter(f => /^retake-practice-\d+\.json$/.test(f)).sort();
let total = 0, exams = 0;
for (const file of RP_FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  if (data.questions.length !== 15) continue;
  exams++;
  for (const q of data.questions) total += (q.hints||[]).length;
}
console.log('gp-1982-total-hints:', total, 'across', exams, 'exams');
console.log('OK -- total hint count snapshot: ' + total);
